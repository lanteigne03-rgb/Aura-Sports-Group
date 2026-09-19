# Aura Sports Group — Website

Static site built from the Figma design (`Aura Sports Group — Website`). No build step — open `index.html` in a browser, or host the folder anywhere (GitHub Pages, Netlify, Vercel).

## Pages

`index.html` (Home) · `the-agency.html` · `our-team.html` · `representation.html` · `nfl.html` · `college-nil.html` · `recruits.html` · `coaches.html` · `draft-prep.html` · `marketing-overview.html` · `brand-inquiries.html` · `news.html` · `contact.html`

## Structure

- `css/styles.css` — design tokens (colors, type, spacing from the Figma design system) + shared components
- `js/news-data.js` / `js/news.js` — the news article list, and the script that renders it (home page tiles, News page, pagination)
- `js/site.js` — injects the shared nav / CTA module / footer, handles scroll nav, mobile menu, reveal animations, and image fallbacks

## Adding a news article

News lives in one file: `js/news-data.js`. The home page "Headlines" section shows the 3 most recent articles; `news.html` shows all of them, 12 per page, with page links (`/news?page=2`, …) appearing automatically once there are more than 12.

1. Put the thumbnail in `assets/img/news/`.
2. Copy an entry in `js/news-data.js`, paste it anywhere in the list, and fill in `title`, `publication`, `url`, `date` (`YYYY-MM-DD`), `image` and `alt`. Order in the file doesn't matter — articles are sorted newest first by `date`.

The field reference is at the top of that file.

## Dropping in real photos

Every photo slot renders a styled placeholder until the matching file exists in `assets/img/`. Add these files and they appear automatically:

| File | Used on |
|---|---|
| `nfl-action.jpg` | Home pathway card, Representation stage |
| `college-football.jpg` | Home pathway card, Representation stage |
| `high-school-football.jpg` | Home pathway card, Representation stage |
| `coach.jpg` | Home pathway card, Representation stage |
| `nfl-hero.jpg` | NFL page hero (wide) |
| `college-hero.jpg` / `college-lens.jpg` | College page |
| `high-school-hero.jpg` | High School page hero (wide) |
| `coach-hero.jpg` | Coaches page hero (wide) |
| `draft-performance.jpg` / `draft-environment.jpg` / `draft-interviews.jpg` / `draft-intel.jpg` | Draft Prep parts |
| `about-story.jpg` | The Agency page |
| `team/member-01.jpg` … `team/member-06.jpg` | Our Team page (one per profile) |
| `assets/video/hero.mp4` | Home hero film (21:9, autoplay muted loop) |

## Fonts

The design uses **Dharma Gothic E ExBold Italic** (commercial). The site falls back to **Anton** (Google Fonts) with synthesized italic. If you license Dharma Gothic E, put the `.woff2` in `assets/fonts/` and uncomment the `@font-face` at the top of `css/styles.css`.

## Before launch

- Replace placeholder service copy on the High School and Coaches pages (flagged in the design).
- Replace the `[ Name ]` / title placeholders and photos on the Our Team page with real profiles.
- Build out the Brand Inquiries page (currently a placeholder shell) — flagged in the design.
- Replace `[ PUBLICATION ] / [ Headline ]` article placeholders on Home with real coverage.
- Wire the contact form (`contact.html`) to your email service or backend.
- Add real social links in the footer (`js/site.js`).
