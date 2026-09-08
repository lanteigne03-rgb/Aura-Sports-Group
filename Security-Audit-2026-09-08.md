# Aura Sports Group — Security Audit

**Date:** September 8, 2026
**Scope:** `Aura-Sports-Group` GitHub repository (static HTML/CSS/JS site, custom domain `aurasmg.com` via `CNAME`)
**Method:** Full review of repository source (all HTML/CSS/JS, git history, forms, external references) plus live checks against the public domain.

## Important note on scope

Before anything else: `aurasmg.com` and `www.aurasmg.com` are currently live on **Wix**, not on this codebase. This repository is a GitHub Pages project with a `CNAME` file pointing at `aurasmg.com`, but the domain hasn't been cut over to it yet — the only place this code is actually reachable right now is the default GitHub Pages URL (`lanteigne03-rgb.github.io/Aura-Sports-Group`). Everything below is an audit of *this codebase*, since that's what's in the repository and what will presumably go live at `aurasmg.com` eventually. It is not an audit of the Wix site currently serving that domain — that's a separate platform outside this repo, and Wix manages its own hosting security. Worth flagging so nobody assumes the live domain has already been checked.

## Overall picture

This is a static site with no backend, no server code, and no npm/third-party dependencies at all — which is good news from a security standpoint, since it removes most of the usual attack surface (no dependency CVEs, no server to exploit, no database to inject into). A scan of the full git history turned up no committed API keys, credentials, or private keys. External links to Instagram, X, and LinkedIn all correctly use `rel="noopener"` alongside `target="_blank"`, so there's no `window.opener` tab-hijacking risk there. The shared nav/footer injection in `js/site.js` builds markup from hardcoded strings only, not user input, so there's no obvious DOM XSS vector in the reviewed code. No `eval`, no `document.write`, no mixed-content (`http://`) resource references.

Two things are worth addressing before or shortly after this goes live.

## Finding 1 — Web3Forms key has no domain restriction or bot verification (Medium)

`contact.html` submits the contact form via `fetch()` directly to `https://api.web3forms.com/submit`, with the access key `4ba98fc8-1334-481c-ae9a-8769641c0b4e` sent in the request body. This is the intended way to use Web3Forms — the key is meant to be public, similar to Formspree — so this isn't a leaked secret in the traditional sense. The problem is that the key currently has no domain allowlist and no CAPTCHA/Turnstile challenge behind it, only a hidden honeypot checkbox (`botcheck`). Since the key is visible in the page's client-side source, anyone can copy it out and call the Web3Forms API directly from a script, completely bypassing the site — using the account's send quota for spam or unwanted email. The honeypot stops naive bots but not someone deliberately scripting against the API. In the Web3Forms dashboard, turn on "Allowed Domains" and restrict it to `aurasmg.com` (and the GitHub Pages domain if that's still used for staging), and add their reCAPTCHA/hCaptcha/Turnstile integration on top of the honeypot. Same recommendation applies to any other form on the site using the same key — worth double-checking `brand-inquiries.html` and any other inquiry forms for the same pattern.

## Finding 2 — No Content-Security-Policy or security headers (Low, defense-in-depth)

None of the pages set a `Content-Security-Policy`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, or `Permissions-Policy`, either via HTTP header or `<meta http-equiv>` tag. GitHub Pages' default hosting doesn't let you set arbitrary HTTP response headers, so the practical fix is a `<meta http-equiv="Content-Security-Policy">` tag in each page's `<head>` (or a shared include if the build process supports it). Given there's currently no user-generated content rendered anywhere and no third-party scripts beyond the Google Fonts stylesheet, the actual exploitable risk today is low — but a CSP is cheap insurance against future changes (e.g., if a comment widget, chat script, or analytics tag gets added later) and against clickjacking, since nothing currently stops the site from being framed by another page. A reasonable starting policy would restrict `script-src` to `'self'`, allow `style-src` for Google Fonts, and set `frame-ancestors 'none'`.

## Before the domain cutover

Once `aurasmg.com` is actually pointed at this GitHub Pages deployment, two things are worth verifying in the repo's Pages settings: that "Enforce HTTPS" is checked (GitHub issues a free Let's Encrypt cert for custom domains automatically, but enforcement is a separate toggle), and that `http://aurasmg.com` correctly redirects to `https://`. It's also worth re-running an external header scan (e.g. securityheaders.com) against the live domain after cutover, since that will reflect the real hosting environment rather than this local review.

## What's already solid

No secrets in git history, no dependency supply-chain surface, safe external link handling, no mixed content, no obvious XSS vectors in the JS that's there, and a `robots.txt`/`sitemap.xml` that don't expose anything sensitive (no disallowed admin paths, no staging URLs). For a marketing site with this little dynamic behavior, the security surface is genuinely small — the two items above are the ones worth actually doing something about.
