/* AURA SPORTS GROUP — shared components + behavior */
(function () {
  "use strict";

  /* ---------- Shared markup ---------- */

  var BARCODE_SHORT =
    "<span class='barcode' aria-hidden='true'>" +
    new Array(15 + 1).join("<i></i>") +
    "</span>";

  var BARCODE_LONG =
    "<span class='barcode' aria-hidden='true'>" +
    new Array(25 + 1).join("<i></i>") +
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
    "<li data-page='news'><a class='nav-link' href='news.html'>News</a></li>" +
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
    "<a href='draft-prep.html'>Draft Prep</a>" +
    "<a href='news.html'>News</a></div>" +
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
    initFilters();
    initSmoothScroll();
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
      community: "services",
      news: "news"
    };
    var active = map[page];
    if (active) {
      var li = nav.querySelector("li[data-page='" + active + "']");
      if (li) li.classList.add("active");
    }

    // solid nav on interior pages (no full-bleed hero image)
    if (document.body.classList.contains("nav-solid")) nav.classList.add("solid");

    // scroll state
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // burger
    var burger = document.getElementById("navBurger");
    var links = document.getElementById("navLinks");
    if (burger && links) {
      burger.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
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

  /* News category filters */
  function initFilters() {
    var filters = document.querySelectorAll(".filter[data-filter]");
    if (!filters.length) return;
    var cards = document.querySelectorAll("[data-category]");
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filters.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var f = btn.getAttribute("data-filter");
        cards.forEach(function (card) {
          card.style.display =
            f === "all" || card.getAttribute("data-category") === f ? "" : "none";
        });
      });
    });
  }

  /* expose barcode helpers for inline use */
  window.AURA = { BARCODE_SHORT: BARCODE_SHORT, BARCODE_LONG: BARCODE_LONG };
})();
