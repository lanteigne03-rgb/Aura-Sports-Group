/* ============================================================
   AURA SPORTS GROUP — Password gate
   ------------------------------------------------------------
   Loaded synchronously from <head> on every page, BEFORE the body
   parses, so the site is never painted while locked.

   Scope of protection — read this before relying on it:
   the site is static (GitHub Pages), so there is no server to check
   a password. This gate keeps out casual visitors and crawlers; it
   does NOT stop anyone who opens View Source, the network tab, or
   fetches the HTML directly, and the files under /assets stay
   publicly reachable by URL. It is a velvet rope, not a lock.

   To change the password: SHA-256 the SALT + the new password and
   paste the hex digest into PASSWORD_HASH below.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Config ---------- */

  var SALT = "aura-sports-group::";
  // sha256("aura-sports-group::" + "MVP2026") — case-sensitive
  var PASSWORD_HASH = "e8df6a04a0554a855a3ef844f280d07ce74c9bd8898da4156c0f65fbdd887225";
  // Session-scoped: one unlock covers every page until the browser
  // is closed. Without this, each internal link would re-prompt.
  var STORAGE_KEY = "asg.gate.v1";

  /* Paths are resolved from this script's own URL rather than from the
     document, so the gate works the same on /nfl, /the-agency and a
     local file:// preview. */
  var script = document.currentScript;
  var BASE = script ? script.src.replace(/js\/gate\.js(\?.*)?$/, "") : "";
  var VIDEO_SRC = BASE + "assets/video/Hero-Vid-Loop.mp4";
  var POSTER_SRC = BASE + "assets/img/hero-poster.jpg";
  var LOGO_SRC = BASE + "assets/img/aura-logo-gold.png";
  var INSTAGRAM_URL = "https://www.instagram.com/aurasports/?hl=en";
  /* The contact page is deliberately left ungated so anyone who needs the
     password has a way to ask for it. */
  var CONTACT_URL = BASE + "contact";

  /* ---------- Locked? ---------- */

  function isUnlocked() {
    try {
      return window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      return false; // private mode / storage blocked — gate stays up
    }
  }

  if (isUnlocked()) return;

  document.documentElement.classList.add("gate-locked");

  /* Start fetching the loop now rather than at DOMContentLoaded. On the
     homepage this is the same URL as the hero's own video, so the two
     share one download.

     The file is attached as a <source> child rather than via video.src,
     to match the hero markup exactly: when a browser can't decode the
     MP4, a <source> failure leaves the poster frame on screen, whereas a
     direct src failure fires an error on the video itself and blanks it.
     That difference is the whole point of the gate looking identical. */
  var video = document.createElement("video");
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("preload", "auto");
  video.poster = POSTER_SRC;

  var source = document.createElement("source");
  source.src = VIDEO_SRC;
  source.type = "video/mp4";
  video.appendChild(source);
  video.load();

  var gate = null;
  var input = null;

  /* ---------- Build ---------- */

  function build() {
    gate = document.createElement("div");
    gate.className = "site-gate";
    gate.id = "siteGate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-label", "Enter password to view this site");

    var media = document.createElement("div");
    media.className = "gate-media";
    media.appendChild(video);

    var scrim = document.createElement("div");
    scrim.className = "gate-scrim";

    var inner = document.createElement("div");
    inner.className = "gate-inner";
    inner.innerHTML =
      '<div class="gate-logo-wrap">' +
        '<img class="gate-logo" src="' + LOGO_SRC + '" alt="Aura Sports Group">' +
        '<img class="gate-logo-glitch gate-logo-glitch--r" src="' + LOGO_SRC + '" alt="" aria-hidden="true">' +
        '<img class="gate-logo-glitch gate-logo-glitch--b" src="' + LOGO_SRC + '" alt="" aria-hidden="true">' +
      '</div>' +
      '<form class="gate-form" novalidate>' +
        '<label class="gate-sr-only" for="gatePassword">Password</label>' +
        // Chrome/Safari only offer to save a password when the form also
        // carries a username field; it is hidden and untabbable.
        '<input class="gate-sr-only" type="text" name="username" value="Aura Sports Group" ' +
          'autocomplete="username" tabindex="-1" aria-hidden="true" readonly>' +
        '<div class="gate-field">' +
          '<input class="gate-input" id="gatePassword" type="password" name="password" ' +
            'placeholder="Enter password" autocomplete="current-password" ' +
            'spellcheck="false" autocapitalize="off" autocorrect="off">' +
          '<button class="gate-submit" type="submit" aria-label="Enter site">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
              'stroke-linecap="square" aria-hidden="true">' +
              '<path d="M4 12h15M13 6l6 6-6 6"/>' +
            '</svg>' +
          '</button>' +
        '</div>' +
        '<p class="gate-error" role="alert">Incorrect password</p>' +
        // Inside the form so it rides the same fade-in and drops out with
        // the field on unlock; .gate-error above reserves its own height,
        // so the link does not move when an attempt fails.
        '<a class="gate-contact" href="' + CONTACT_URL + '">Contact us</a>' +
      '</form>';

    gate.appendChild(media);
    gate.appendChild(scrim);
    gate.appendChild(inner);

    /* Instagram link pinned to the bottom of the screen. It shares the
       password field's fade-in timing (see .gate-social in gate.css). */
    var social = document.createElement("a");
    social.className = "gate-social";
    social.href = INSTAGRAM_URL;
    social.target = "_blank";
    social.rel = "noopener";
    social.setAttribute("aria-label", "Aura Sports Group on Instagram");
    social.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="3" y="3" width="18" height="18" rx="5"/>' +
        '<circle cx="12" cy="12" r="4"/>' +
        '<circle cx="17.4" cy="6.6" r="0.7" fill="currentColor" stroke="none"/>' +
      '</svg>';
    gate.appendChild(social);

    document.body.appendChild(gate);

    var play = video.play();
    if (play && play.catch) play.catch(function () {});

    input = gate.querySelector(".gate-input");
    var form = gate.querySelector(".gate-form");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      submit();
    });
    input.addEventListener("input", function () {
      gate.classList.remove("is-error");
    });

    /* Focus once the field has risen into view — but not on touch, where
       it would throw the keyboard over the hero the moment it appears. */
    if (window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
      setTimeout(function () {
        if (input && document.contains(input)) input.focus();
      }, 4100);
    }
  }

  function submit() {
    var value = (input.value || "").trim();
    if (!value) return;

    if (sha256(utf8(SALT + value)) === PASSWORD_HASH) {
      unlock();
    } else {
      gate.classList.remove("is-error");
      void gate.offsetWidth; // restart the shake if they miss twice
      gate.classList.add("is-error");
      input.select();
    }
  }

  /* ---------- Unlock ---------- */

  function unlock() {
    try { window.sessionStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
    gate.classList.add("is-unlocking");
    setTimeout(reveal, 260); // let the field drop out first
  }

  function reveal() {
    document.documentElement.classList.remove("gate-locked");

    /* Pins the real hero's logo in its finished state so the cross-fade
       lands on an identical frame instead of re-running the glitch. */
    document.body.classList.add("gate-revealed");

    /* site.js's hero observer ran against a display:none hero and set
       .hero-out (header logo shown). It will correct itself on the next
       frame, but clearing it here avoids a one-frame flash. */
    document.body.classList.remove("hero-out");

    var heroVideo = document.querySelector(".hero-media video");
    if (heroVideo) {
      try { heroVideo.currentTime = video.currentTime; } catch (e) {}
      var p = heroVideo.play();
      if (p && p.catch) p.catch(function () {});
    }

    /* site.js measured --nav-h and built its IntersectionObservers while
       the body was hidden (every rect was 0). Re-run that measurement. */
    window.dispatchEvent(new Event("resize"));

    gate.classList.add("is-gone");
    setTimeout(function () {
      if (gate && gate.parentNode) gate.parentNode.removeChild(gate);
    }, 800);
  }

  /* ---------- Boot ---------- */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }

  /* ---------- Helpers ---------- */

  function utf8(str) {
    return unescape(encodeURIComponent(str));
  }

  /* Compact SHA-256 over a byte string. Used instead of crypto.subtle so
     the gate also works outside a secure context (file:// previews). */
  function sha256(ascii) {
    function rr(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var i, j;
    var result = "";
    var words = [];
    var asciiBitLength = ascii.length * 8;
    var hash = sha256.h = sha256.h || [];
    var k = sha256.k = sha256.k || [];
    var primeCounter = k.length;
    var isComposite = {};

    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) { isComposite[i] = candidate; }
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    ascii += "\x80";
    while (ascii.length % 64 - 56) ascii += "\x00";
    for (i = 0; i < ascii.length; i++) {
      j = ascii.charCodeAt(i);
      if (j >> 8) return "";
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;

    for (j = 0; j < words.length;) {
      var w = words.slice(j, j += 16);
      var oldHash = hash;
      hash = hash.slice(0, 8);

      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2];
        var a = hash[0], e = hash[4];
        var temp1 = hash[7]
          + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25))
          + ((e & hash[5]) ^ (~e & hash[6]))
          + k[i]
          + (w[i] = i < 16 ? w[i] : (
              w[i - 16]
              + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3))
              + w[i - 7]
              + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))
            ) | 0);
        var temp2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22))
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }

      for (i = 0; i < 8; i++) { hash[i] = (hash[i] + oldHash[i]) | 0; }
    }

    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        var b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? 0 : "") + b.toString(16);
      }
    }
    return result;
  }
})();
