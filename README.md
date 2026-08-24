# Aura Sports Group — Website

Static site built from the Figma design (`Aura Sports Group — Website`). No build step — open `index.html` in a browser, or host the folder anywhere (GitHub Pages, Netlify, Vercel).

## Pages

`index.html` (Home) · `the-agency.html` · `our-team.html` · `representation.html` · `nfl.html` · `college-nil.html` · `recruits.html` · `coaches.html` · `draft-prep.html` · `marketing-overview.html` · `brand-inquiries.html` · `contact.html`

## Structure

- `css/styles.css` — design tokens (colors, type, spacing from the Figma design system) + shared components
- `js/site.js` — injects the shared nav / CTA module / footer, handles scroll nav, mobile menu, reveal animations, and image fallbacks

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
| `high-school-hero.jpg` | Recruits page hero (wide) |
| `coach-hero.jpg` | Coaches page hero (wide) |
| `draft-performance.jpg` / `draft-environment.jpg` / `draft-interviews.jpg` / `draft-intel.jpg` | Draft Prep parts |
| `about-story.jpg` | The Agency page |
| `team/member-01.jpg` … `team/member-06.jpg` | Our Team page (one per profile) |
| `assets/video/hero.mp4` | Home hero film (21:9, autoplay muted loop) |

## Fonts

The design uses **Dharma Gothic E ExBold Italic** (commercial). The site falls back to **Anton** (Google Fonts) with synthesized italic. If you license Dharma Gothic E, put the `.woff2` in `assets/fonts/` and uncomment the `@font-face` at the top of `css/styles.css`.

## Before launch

- Replace placeholder service copy on the Recruits and Coaches pages (flagged in the design).
- Replace the `[ Name ]` / title placeholders and photos on the Our Team page with real profiles.
- Build out the Brand Inquiries page (currently a placeholder shell) — flagged in the design.
- Replace `[ PUBLICATION ] / [ Headline ]` article placeholders on Home with real coverage.
- Wire the contact form (`contact.html`) to your email service or backend.
- Add real social links in the footer (`js/site.js`).
