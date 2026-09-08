/* ---------------------------------------------------------------
   Aura Sports Group — under-construction password gate
   ---------------------------------------------------------------
   Quick, client-side lock screen for while the site is being built.

   IMPORTANT: this is a soft deterrent, not real security. The password
   lives in this file and is visible to anyone who views page source or
   opens dev tools — a technically inclined visitor can bypass it. Don't
   rely on this to protect anything sensitive. For real protection,
   put the site behind Cloudflare Access (or similar) instead.

   To change the password: edit PASSWORD below.
   To remove the gate entirely: delete the
   <script src="js/gate.js"></script> line from every page's <body>,
   and delete this file.
------------------------------------------------------------------ */
(function () {
  "use strict";

  var PASSWORD = "705";
  var STORAGE_KEY = "auraGateUnlocked";

  // Already unlocked this browser? Skip the gate entirely.
  try {
    if (window.localStorage.getItem(STORAGE_KEY) === "1") return;
  } catch (e) {
    // localStorage unavailable (e.g. private mode edge case) — fall through
    // and show the gate every time rather than failing open.
  }

  var doc = document;
  var html = doc.documentElement;
  var prevOverflow = html.style.overflow;
  html.style.overflow = "hidden";

  var overlay = doc.createElement("div");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Site under construction — password required");
  overlay.style.cssText = [
    "position:fixed", "inset:0", "z-index:2147483647",
    "background:#08080a",
    "display:flex", "align-items:center", "justify-content:center",
    "padding:24px", "box-sizing:border-box",
    "font-family:'Montserrat','Helvetica Neue',Arial,sans-serif"
  ].join(";");

  overlay.innerHTML =
    '<form id="auraGateForm" style="width:100%;max-width:360px;text-align:center;">' +
      '<div style="font-family:\'Anton\',\'Arial Narrow\',sans-serif;letter-spacing:0.04em;' +
        'font-size:clamp(28px,5vw,38px);color:#f4f2ed;margin-bottom:8px;">AURA SPORTS GROUP</div>' +
      '<div style="color:#c6a567;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;' +
        'margin-bottom:28px;">Site under construction</div>' +
      '<input id="auraGateInput" type="password" autocomplete="off" placeholder="Password" ' +
        'style="width:100%;box-sizing:border-box;padding:14px 16px;font-size:16px;' +
        'background:#17171b;border:1px solid #2e2e36;border-radius:4px;color:#f4f2ed;' +
        'margin-bottom:14px;outline:none;" />' +
      '<button type="submit" style="width:100%;padding:14px 16px;font-size:14px;' +
        'letter-spacing:0.08em;text-transform:uppercase;font-weight:600;border:none;' +
        'border-radius:4px;background:#c6a567;color:#08080a;cursor:pointer;">Enter</button>' +
      '<div id="auraGateError" style="display:none;color:#e3a94f;font-size:13px;margin-top:14px;">' +
        'Incorrect password — try again.</div>' +
    '</form>';

  doc.body.appendChild(overlay);

  var form = overlay.querySelector("#auraGateForm");
  var input = overlay.querySelector("#auraGateInput");
  var error = overlay.querySelector("#auraGateError");

  setTimeout(function () { input.focus(); }, 0);

  form.addEventListener("submit", function (evt) {
    evt.preventDefault();
    if (input.value === PASSWORD) {
      try { window.localStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
      html.style.overflow = prevOverflow;
      overlay.parentNode.removeChild(overlay);
    } else {
      error.style.display = "block";
      input.value = "";
      input.focus();
    }
  });
})();
