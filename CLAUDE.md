# Penn Automotive Website — Claude Instructions

## Project Overview
Static site for Penn Automotive (pennauto.us), a family-run collision repair shop in West Homestead, PA. Built with Eleventy (11ty) + Nunjucks templates. Deployed on Netlify from the `main` branch of `jordanfeldman/pennauto-website` on GitHub.

## Stack
- **Generator**: Eleventy v2 (`npm start` to dev, `npm run build` to build)
- **Templates**: Nunjucks (`.njk`) in `src/`
- **Layout**: `src/_includes/base.njk` — shared header, nav, footer for all pages
- **CSS**: Single file at `src/assets/css/style.css` — no framework, custom properties in `:root`
- **JS**: `src/assets/js/main.js` — mobile nav toggle + platform-aware maps link switching
- **CMS**: Decap CMS at `/admin` (for non-technical editors)
- **Output**: `_site/` (gitignored, built by Netlify)

## Pages
| File | URL |
|---|---|
| `src/index.njk` | `/` — Home |
| `src/collision.njk` | `/collision/` |
| `src/about.njk` | `/about/` |
| `src/contact.njk` | `/contact/` |
| `src/photos.njk` | `/photos/` |
| `src/policies.njk` | `/policies/` |

## Key Design Decisions
- **Email is the preferred contact method** — `joel@pennauto.us` should be the primary CTA button (red), phone number secondary
- **Maps links use `data-map` attribute** — JS in `main.js` detects Apple vs non-Apple and swaps href to Apple Maps or Google Maps accordingly. Always use `data-map` on any directions link; set the fallback `href` to Google Maps
- **Copyright year** — uses `{% year %}` Eleventy shortcode (defined in `.eleventy.js`), never hardcode the year
- **Images** live in `src/assets/images/`. Run `node scripts/optimize-images.js` after adding new images (uses sharp)
- **Global `li + li` margin** — there's a global `li + li { margin-top: 0.5rem }` rule. Always add `margin-top: 0` to nav `li` elements to prevent misalignment in flex rows

## Brand
- **Primary color**: `#c0392b` (Penn red)
- **Font**: System UI stack — no external fonts
- **Tone**: Trustworthy, local, family-run. Not corporate. Emphasize Joel's engineering background and the lifetime warranty.

## Business Info
- **Phone**: (412) 461-7500
- **Email**: joel@pennauto.us
- **Address**: 243 West 8th Ave, West Homestead, PA 15120
- **Hours**: Mon–Fri 8:00 AM – 5:00 PM, Sat by appointment, Sun closed

## Reviews
- **Google**: 4.8★ / 221 reviews (as of June 2026) — fetch live via Chrome browser tool if needed
- Reviews section is hardcoded in `src/index.njk` — update manually when adding new ones

## Common Tasks

### Adding a new photo
1. Drop the image into `src/assets/images/`
2. Run `node scripts/optimize-images.js` (add the new file to the array in the script first)
3. Reference it in the relevant `.njk` file as `/assets/images/filename.jpg`

### Updating business hours
Edit the hours table in `src/contact.njk` and the Google Maps listing separately (they're not synced).

### Adding a new page
1. Create `src/pagename.njk` with frontmatter `layout: base.njk`, `title`, `permalink`
2. Add a link to it in the nav in `src/_includes/base.njk` and the footer Quick Links

### Updating reviews
Edit the `.review-card` blocks in `src/index.njk`. To fetch fresh reviews, use the Chrome browser tool to navigate to Google Maps and read the reviews page directly.

### Deploying
Push to `main` on GitHub — Netlify auto-deploys. Build command: `npm run build`, publish dir: `_site`.
