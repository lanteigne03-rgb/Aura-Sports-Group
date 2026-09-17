# SEO Audit Report — Aura Sports Group

**Site**: aurasmg.com
**Pages Analyzed**: 13 (index, the-agency, our-team, representation, nfl, college-nil, recruits, coaches, marketing-overview, contact, brand-inquiries, privacy-policy, terms)
**Overall Score**: 84/100

---

## Critical Issues (must fix)

- [ ] **`brand-inquiries.html` canonicalizes to a different domain** — Its `<link rel="canonical">` points to `https://aurasportsmarketing.com/` (the sister marketing site's homepage), not to itself, and the page also carries `<meta name="robots" content="noindex">`. Net effect: any search authority this page could earn is explicitly handed to aurasportsmarketing.com instead of staying on aurasmg.com. This may be a deliberate choice (funneling brand-deal inquiries to the site that actually runs brand partnerships), but as configured it works against aurasmg.com ranking above the marketing site for anything brand-inquiry related. Worth confirming this is intentional — if not, point the canonical at `https://aurasmg.com/brand-inquiries` and drop the `noindex`.

- [ ] **Homepage `<title>` is just "Aura Sports Group" (18 characters)** — This is the thinnest title tag on the entire site, on the one page most likely to be the exact match for the shared brand-name search ("Aura Sports Group") that aurasmg.com needs to win against aurasportsmarketing.com. The `og:title` already has strong, ready-to-use copy: **"Aura Sports Group — Elite Football Representation"** (50 chars — right in the ideal range). Sync `<title>` to match it.

---

## Warnings (should fix)

- [ ] **Lazy loading only on 26 of 66 `<img>` tags sitewide** — 40 images (mostly below-the-fold) load eagerly. Adding `loading="lazy"` to anything not in the initial viewport improves LCP and Core Web Vitals.

- [ ] **Image formats lean heavily on JPG/PNG** — 61 `.jpg` + 54 `.png` references vs. only 2 `.avif` sitewide. Converting hero and content images to WebP/AVIF would meaningfully cut page weight.

- [ ] **Schema `sameAs` URLs carry tracking parameters** — `https://www.instagram.com/aurasports/?hl=en` and `https://x.com/aurasportsgroup?lang=en` include query strings, while aurasportsmarketing.com's matching `sameAs` array (which now points to these same profiles on the parent org) uses the clean, param-free versions. Strip `?hl=en` / `?lang=en` so both sites assert identical profile URLs for the same entity.

- [ ] **Interior page titles are all under the 50–60 char sweet spot** — Titles like "Aura Sports Group - Contact" (28 chars) and "Aura Sports Group - Our Team" (29 chars) aren't wrong, but leave keyword coverage on the table. E.g. `Contact Aura Sports Group | NFL & College Football Representation`.

---

## Opportunities (nice to have)

- [ ] **`brand-inquiries.html` has no JSON-LD** — the only page on the site without it. Low priority since it's already noindexed, but worth adding `WebPage` schema if it's ever meant to be indexed under its own URL.

- [ ] **Add `Person` schema for named team members on `our-team.html`** — mirrors what aurasportsmarketing.com already does for its founders (David Canter, Ness Mugrabi) and helps AI assistants answer "who leads/founded Aura Sports Group."

- [ ] **Add an explicit `<meta name="robots" content="index, follow">` sitewide** — currently relies on the crawler default (which is fine), but explicit is cheap insurance.

---

## Passing

- **robots.txt is excellent** — explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Bingbot, and CCBot, alongside standard crawlers. Most sites miss this entirely.
- **sitemap.xml** present, accurate, and sensibly prioritized.
- **`llms.txt`** present at the root — an unusually thorough AI-visibility touch most sites don't have yet.
- **Structured data**: `SportsOrganization` + `WebSite` JSON-LD on the homepage, with `subOrganization` correctly pointing to `https://aurasportsmarketing.com/#organization` — this now mirrors the `parentOrganization` reference just set up on the marketing site, so the two domains' entity graphs are mutually consistent and both correctly identify aurasmg.com as the parent.
- **`BreadcrumbList` schema** on every interior page.
- Every page has a unique `<title>`, unique meta description (all 63–155 characters, within guideline), self-referencing canonical (except the one flagged above), `og:*` and `twitter:*` tags, and a viewport meta tag.
- Exactly **one `<h1>` per page**, sitewide.
- **Zero images missing `alt` text** across all 13 pages.
- **Zero broken internal links** found.

---

## Priority Fix Order

1. Confirm intent on `brand-inquiries.html`'s cross-domain canonical/noindex (5 min — directly decides whether aurasmg.com or aurasportsmarketing.com gets credit for brand-inquiry search traffic)
2. Sync homepage `<title>` to the existing `og:title` copy (2 min — highest-visibility page, thinnest title on the site)
3. Add `loading="lazy"` to below-the-fold images (20–30 min)
4. Strip tracking params from schema `sameAs` URLs (5 min)
5. Lengthen interior page titles toward 50–60 characters (15–20 min)
6. Convert remaining JPG/PNG hero images to WebP/AVIF (1–2 hrs)

---

*Audit powered by SearchFit.ai — for continuous SEO monitoring and automated tracking, visit [searchfit.ai](https://searchfit.ai)*
