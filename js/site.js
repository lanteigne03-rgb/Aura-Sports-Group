/* AURA SPORTS GROUP — shared components + behavior */
(function () {
  "use strict";

  /* ---------- Shared markup ---------- */

  var BARCODE_SHORT =
    "<span class='barcode' aria-hidden='true'>" +
    new Array(10 + 1).join("<i></i>") +
    "</span>";

  var BARCODE_LONG =
    "<span class='barcode' aria-hidden='true'>" +
    new Array(10 + 1).join("<i></i>") +
    "</span>";

  function logo(cls) {
    return (
      "<a class='logo-lockup " + (cls || "") + "' href='index.html' aria-label='Aura Sports Group — Home'>" +
      "<img class='logo-mark' src='assets/img/aura-logo.svg' alt='Aura Sports Group' width='999' height='293'>" +
      "</a>"
    );
  }

  var NAV_HTML =
    "<nav class='site-nav' id='siteNav'>" +
    logo("") +
    "<button class='nav-burger' id='navBurger' aria-label='Menu' aria-expanded='false'>" +
    "<span></span><span></span><span></span></button>" +
    "<ul class='nav-links' id='navLinks'>" +
    "<li data-page='about'><a class='nav-link' href='about.html'>About</a></li>" +
    "<li data-page='representation'><a class='nav-link' href='representation.html'>Representation</a>" +
    "<div class='nav-drop'>" +
    "<a href='nfl.html'>NFL</a>" +
    "<a href='college-nil.html'>College</a>" +
    "<a href='recruits.html'>Recruits</a>" +
    "<a href='coaches.html'>Coaches</a>" +
    "</div></li>" +
    "<li data-page='services'><a class='nav-link' href='marketing.html'>Services</a>" +
    "<div class='nav-drop'>" +
    "<a href='marketing.html'>Marketing &amp; Brand</a>" +
    "<a href='athlete-care.html'>Athlete Care</a>" +
    "<a href='business.html'>Business &amp; Analytics</a>" +
    "<a href='health.html'>Health &amp; Performance</a>" +
    "<a href='community.html'>Community &amp; Legacy</a>" +
    "</div></li>" +
    "<li data-page='contact'><a class='nav-link' href='contact.html'>Contact</a></li>" +
    "</ul>" +
    "</nav>";

  function ctaModule(headlineHTML) {
    return (
      "<section class='cta-module'>" +
      "<h2>" + headlineHTML + "</h2>" +
      "<div class='cta-row'>" +
      BARCODE_SHORT.replace("barcode", "barcode barcode--white barcode--bright") +
      "<a class='btn btn--primary' href='contact.html'>Start a Conversation</a>" +
      BARCODE_SHORT.replace("barcode", "barcode barcode--white barcode--bright") +
      "</div>" +
      "</section>"
    );
  }

  var FOOTER_HTML =
    "<footer class='site-footer'>" +
    "<div class='top'>" +
    logo("logo-lockup--footer") +
    "<div class='footer-cols'>" +
    "<div class='footer-col'><span class='col-title'>Agency</span>" +
    "<a href='about.html'>About</a>" +
    "<a href='representation.html'>Representation</a></div>" +
    "<div class='footer-col'><span class='col-title'>Services</span>" +
    "<a href='marketing.html'>Marketing &amp; Brand</a>" +
    "<a href='athlete-care.html'>Athlete Care</a>" +
    "<a href='business.html'>Business &amp; Analytics</a>" +
    "<a href='health.html'>Health &amp; Performance</a>" +
    "<a href='community.html'>Community &amp; Legacy</a></div>" +
    "<div class='footer-col'><span class='col-title'>Connect</span>" +
    "<a href='contact.html'>Contact</a>" +
    "<a href='#' rel='noopener'>Instagram</a>" +
    "<a href='#' rel='noopener'>X / Twitter</a>" +
    "<a href='#' rel='noopener'>LinkedIn</a></div>" +
    "</div></div>" +
    "<div class='bottom'>" +
    "<p>© 2026 Aura Sports Group. All rights reserved.</p>" +
    "<div class='legal'><a href='#'>Privacy Policy</a><a href='#'>Terms</a></div>" +
    "</div>" +
    "</footer>";

  /* ---------- Injection ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    var navMount = document.getElementById("nav-placeholder");
    if (navMount) navMount.outerHTML = NAV_HTML;

    var ctaMount = document.getElementById("cta-placeholder");
    if (ctaMount) {
      var headline =
        ctaMount.getAttribute("data-headline") ||
        "Your career deserves<br>a long-term plan.";
      ctaMount.outerHTML = ctaModule(headline);
    }

    var footMount = document.getElementById("footer-placeholder");
    if (footMount) footMount.outerHTML = FOOTER_HTML;

    initNav();
    initReveal();
    initMediaFallbacks();
    initSmoothScroll();
    initHeroLogoToggle();
  });

  /* ---------- Behavior ---------- */

  function initNav() {
    var nav = document.getElementById("siteNav");
    if (!nav) return;

    // Mirror the bar's real rendered height onto --nav-h so the mobile
    // full-screen menu (top: var(--nav-h)) starts exactly at its bottom
    // edge instead of a hardcoded guess — the bar's height changes with
    // the 900px breakpoint (padding + logo size both shrink), so this is
    // re-measured on resize, not just once at load.
    var syncNavHeight = function () {
      document.documentElement.style.setProperty("--nav-h", nav.offsetHeight + "px");
    };
    syncNavHeight();
    var navHeightResizeTimer = null;
    window.addEventListener(
      "resize",
      function () {
        clearTimeout(navHeightResizeTimer);
        navHeightResizeTimer = setTimeout(syncNavHeight, 150);
      },
      { passive: true }
    );

    // active link highlight
    var page = (location.pathname.split("/").pop() || "index.html").replace(".html", "");
    var map = {
      about: "about",
      representation: "representation",
      nfl: "representation",
      "college-nil": "representation",
      recruits: "representation",
      coaches: "representation",
      marketing: "services",
      "athlete-care": "services",
      business: "services",
      health: "services",
      community: "services",
      contact: "contact"
    };
    var active = map[page];
    if (active) {
      var li = nav.querySelector("li[data-page='" + active + "']");
      if (li) li.classList.add("active");
    }

    // solid nav on interior pages (no full-bleed hero image)
    if (document.body.classList.contains("nav-solid")) nav.classList.add("solid");

    // scroll state
    var links = document.getElementById("navLinks");
    var lastScrollY = window.scrollY;
    var onScroll = function () {
      var y = window.scrollY;

      // hide the bar as the page scrolls down, reveal it again on the
      // way up; skip this while the mobile menu is open, and ignore the
      // rubber-band region right at the top so it never hides too early
      var menuOpen = links && links.classList.contains("open");
      if (!menuOpen) {
        if (y <= 40) {
          nav.classList.remove("nav-hidden");
        } else if (y > lastScrollY) {
          nav.classList.add("nav-hidden");
        } else if (y < lastScrollY) {
          nav.classList.remove("nav-hidden");
        }
      }

      // the solid background is decided *after* the hide state, and only
      // applies while the bar is actually visible — otherwise, on a hero
      // page, scrolling down flashes the solid bar for a beat before it
      // slides away. On the way back up, both land on the same tick, so
      // the bar reappears already in its solid state instead of fading
      // it in separately.
      nav.classList.toggle("scrolled", y > 40 && !nav.classList.contains("nav-hidden"));

      lastScrollY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // burger
    var burger = document.getElementById("navBurger");
    var heroVideo = document.querySelector(".hero-media video");
    var setMenuOpen = function (open) {
      links.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
      if (open) {
        nav.classList.remove("nav-hidden");
        // pause the hero video while the full-screen menu is up — on iOS
        // Safari a playing <video> can be promoted to its own compositing
        // layer and paint through the menu regardless of z-index, so this
        // removes the source of the bleed-through rather than just hoping
        // the overlay wins the stacking order
        if (heroVideo && !heroVideo.paused) {
          heroVideo.dataset.pausedByNav = "1";
          heroVideo.pause();
        }
      } else if (heroVideo && heroVideo.dataset.pausedByNav) {
        delete heroVideo.dataset.pausedByNav;
        heroVideo.play().catch(function () {});
      }
    };
    if (burger && links) {
      burger.addEventListener("click", function () {
        setMenuOpen(!links.classList.contains("open"));
      });
      // close on Escape
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && links.classList.contains("open")) setMenuOpen(false);
      });
      // close whenever a real navigation happens from inside the menu
      // (leaf links only — parent items with a dropdown are handled below)
      links.querySelectorAll("a.nav-link").forEach(function (a) {
        var li = a.closest("li");
        if (li && li.querySelector(".nav-drop")) return;
        a.addEventListener("click", function () { setMenuOpen(false); });
      });
      links.querySelectorAll(".nav-drop a").forEach(function (a) {
        a.addEventListener("click", function () { setMenuOpen(false); });
      });
      // mobile: tap a parent item toggles its dropdown
      links.querySelectorAll("li").forEach(function (li) {
        var drop = li.querySelector(".nav-drop");
        if (!drop) return;
        li.querySelector("a.nav-link").addEventListener("click", function (e) {
          if (window.innerWidth <= 900 && !li.classList.contains("open")) {
            e.preventDefault();
            li.classList.add("open");
          }
        });
      });
    }
  }

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(function (el) { io.observe(el); });
  }

  /* Show the styled placeholder until a real image exists in assets/img.
     Drop a file with the matching name and it appears automatically. */
  function initMediaFallbacks() {
    document.querySelectorAll(".media-ph img").forEach(function (img) {
      img.hidden = true;
      img.addEventListener("load", function () { img.hidden = false; });
      img.addEventListener("error", function () { img.hidden = true; });
      if (img.complete && img.naturalWidth > 0) img.hidden = false;
      else if (img.src) { var s = img.src; img.src = ""; img.src = s; }
    });
  }

  /* Light momentum-style easing on wheel scroll for a smoother feel.
     Skips touch/coarse pointers (native touch scroll is already smooth)
     and respects prefers-reduced-motion. */
  function initSmoothScroll() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (!("requestAnimationFrame" in window)) return;

    var ease = 0.28;
    var current = window.scrollY;
    var target = current;
    var raf = null;

    function clamp(v) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      return Math.max(0, Math.min(v, max));
    }

    function update() {
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.4) {
        current = target;
        raf = null;
      } else {
        raf = requestAnimationFrame(update);
      }
      // behavior: "instant" bypasses the page's CSS scroll-behavior:smooth,
      // which would otherwise re-smooth every frame on top of this easing
      // (causing sluggishness and a snap at the end).
      window.scrollTo({ top: current, left: 0, behavior: "instant" });
    }

    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey) return; // let pinch-zoom through untouched
      e.preventDefault();
      target = clamp(target + e.deltaY);
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: false });

    // stay in sync with non-wheel scrolling (keyboard, scrollbar drag, anchors)
    window.addEventListener("scroll", function () {
      if (!raf) {
        current = window.scrollY;
        target = current;
      }
    }, { passive: true });
  }

  /* Header logo reveal: only relevant on the home page, where the hero
     carries its own logo. Adds .hero-out to <body> as soon as the hero
     logo passes behind the fixed header (not merely once it's fully off
     screen), so the header logo fades in right as the hero one disappears
     under it; removed again once the hero logo re-emerges below the header.

     The observer's root is shrunk from the top by the header's own height
     (via rootMargin), so "intersecting" means "visible below the header,"
     not just "visible in the viewport." Recomputed on resize since the
     header's height changes at the mobile breakpoint. */
  function initHeroLogoToggle() {
    var heroLogo = document.querySelector(".hero-logo");
    var nav = document.getElementById("siteNav");
    if (!heroLogo) return;

    if (!("IntersectionObserver" in window)) {
      document.body.classList.add("hero-out");
      return;
    }

    var io = null;

    function build() {
      if (io) io.disconnect();
      var navHeight = nav ? Math.ceil(nav.getBoundingClientRect().height) : 0;
      io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            document.body.classList.toggle("hero-out", !entry.isIntersecting);
          });
        },
        { threshold: 0, rootMargin: "-" + navHeight + "px 0px 0px 0px" }
      );
      io.observe(heroLogo);
    }

    build();

    var resizeTimer = null;
    window.addEventListener(
      "resize",
      function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(build, 150);
      },
      { passive: true }
    );
  }

  /* expose barcode helpers for inline use */
  window.AURA = { BARCODE_SHORT: BARCODE_SHORT, BARCODE_LONG: BARCODE_LONG };
})();
