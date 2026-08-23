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
    "<a href='college-nil.html'>College / NIL</a>" +
    "<a href='high-school.html'>High School</a>" +
    "<a href='coaches.html'>Coaches</a>" +
    "</div></li>" +
    "<li data-page='draft-prep'><a class='nav-link' href='draft-prep.html'>Draft Prep</a></li>" +
    "<li data-page='services'><a class='nav-link' href='marketing.html'>Services</a>" +
    "<div class='nav-drop'>" +
    "<a href='marketing.html'>Marketing &amp; Brand</a>" +
    "<a href='athlete-care.html'>Athlete Care</a>" +
    "<a href='business.html'>Business &amp; Analytics</a>" +
    "<a href='health.html'>Health &amp; Performance</a>" +
    "<a href='community.html'>Community &amp; Legacy</a>" +
    "</div></li>" +
    "</ul>" +
    "<a class='nav-cta' href='contact.html'><span class='nav-cta-label'>Contact Us</span></a>" +
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
    "<a href='representation.html'>Representation</a>" +
    "<a href='draft-prep.html'>Draft Prep</a></div>" +
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

    // active link highlight
    var page = (location.pathname.split("/").pop() || "index.html").replace(".html", "");
    var map = {
      about: "about",
      representation: "representation",
      nfl: "representation",
      "college-nil": "representation",
      "high-school": "representation",
      coaches: "representation",
      "draft-prep": "draft-prep",
      marketing: "services",
      "athlete-care": "services",
      business: "services",
      health: "services",
      community: "services"
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
    var scrollLockY = 0;

    // iOS Safari only honors `overflow: hidden` on <html>/<body> for
    // wheel/keyboard scrolling — a real phone can still drag-scroll the
    // page behind the mobile menu with a touch gesture even though the
    // page looks fully locked in desktop testing. Pinning the body in
    // place with position:fixed removes it as a scrollable box entirely
    // (which iOS *does* respect), then the exact scroll offset is
    // restored on close so the page doesn't jump.
    function lockBodyScroll() {
      scrollLockY = window.pageYOffset || document.documentElement.scrollTop || 0;
      document.documentElement.classList.add("menu-open");
      document.body.classList.add("menu-open");
      document.body.style.position = "fixed";
      document.body.style.top = -scrollLockY + "px";
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    }

    function unlockBodyScroll() {
      document.documentElement.classList.remove("menu-open");
      document.body.classList.remove("menu-open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollLockY);
    }

    var updateNavAppearance = function () {
      var y = window.scrollY;
      var menuOpen = links && links.classList.contains("open");

      // hide the bar as the page scrolls down, reveal it again on the
      // way up; skip this while the mobile menu is open, and ignore the
      // rubber-band region right at the top so it never hides too early
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
      //
      // The mobile menu panel is always opaque, but the 76px header strip
      // above it only got its own solid background from scroll position —
      // so opening the menu at the very top of a page (e.g. right on the
      // hero) left that strip transparent, exposing hero content through
      // a gap above an otherwise opaque menu. Forcing "scrolled" on
      // whenever the menu is open closes that gap.
      nav.classList.toggle(
        "scrolled",
        menuOpen || (y > 40 && !nav.classList.contains("nav-hidden"))
      );

      lastScrollY = y;
    };
    window.addEventListener("scroll", updateNavAppearance, { passive: true });
    updateNavAppearance();

    // burger
    var burger = document.getElementById("navBurger");
    if (burger && links) {
      var closeMenu = function () {
        links.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Menu");
        unlockBodyScroll();
        links.querySelectorAll("li.open").forEach(function (li) {
          li.classList.remove("open");
        });
        updateNavAppearance();
      };

      burger.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        // Morphs the burger's three bars into an X (see the
        // .nav-burger.open rules in styles.css) so the icon itself
        // confirms the tap and shows how to close the menu again.
        burger.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        burger.setAttribute("aria-label", open ? "Close menu" : "Menu");
        if (open) {
          lockBodyScroll();
        } else {
          unlockBodyScroll();
        }
        if (open) nav.classList.remove("nav-hidden");
        updateNavAppearance();
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

      // rotating to landscape or resizing past the mobile breakpoint
      // while the menu is open used to leave the body scroll-locked and
      // the header forced solid with no way to close it (the burger is
      // hidden above 900px) — close it automatically instead.
      window.addEventListener(
        "resize",
        function () {
          if (window.innerWidth > 900 && links.classList.contains("open")) {
            closeMenu();
          }
        },
        { passive: true }
      );
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
