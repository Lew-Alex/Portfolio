# alexlewandowski.ca

Personal portfolio: competition robotics, embedded systems and mechanical design.
React 19 + Vite, deployed to GitHub Pages.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # serve the built site
npm run lint       # oxlint
```

Deploys automatically on push to `main` via `.github/workflows/deploy.yml`
(lint → build → upload → deploy). `public/CNAME` points the site at
`alexlewandowski.ca`.

## Where the content lives

**Everything you'd normally want to change is in `src/data/portfolio.js`.**
Components only decide layout, no copy is hard-coded in them.

| Export | Drives |
|---|---|
| `profile` | hero (name, location, availability, headline, intro, hero photo + caption), Focus/Tools/Now rows, email, resume, socials |
| `about` | About section prose |
| `skills` | grouped skill lists |
| `experience` | the VEX timeline; each entry can carry `seasons` |
| `projects` | the "Projects" index and every `/projects/:slug` page |

### Project detail pages are composed from blocks

A project renders as a long-form page when its `sections` array is non-empty,
and as a simpler carousel page when it isn't. Blocks are declared in order:

```js
sections: [
  { type: 'prose',       title: 'Overview',  paragraphs: ['…'] },
  { type: 'spec-grid',   title: 'Electronics', intro: '…', specs: [{ label: 'MCU', value: 'ESP32' }] },
  { type: 'stats',       title: 'Results',   stats: [{ value: '6.2', label: 'ft/s', note: 'measured' }] },
  { type: 'figure-grid', title: 'Build',     images: [{ src: '/images/x.jpg', caption: '…' }] },
  { type: 'video',       title: 'Field test', video: { src: '/videos/x.mp4', caption: '…' } },
  { type: 'gallery',     title: 'Gallery',   items: [{ type: 'image', src: '…', caption: '…' }] },
  { type: 'callout',     title: 'Note',      text: '…' },
],
```

Search the data file for `TODO(Alex)`: those are the places only you can fill in
(the Sailing Compass write-up, the `Now` row, the Push Back and Over Under seasons).

Media goes in `public/` and is referenced by absolute path (`/images/…`,
`/videos/…`). Captions are optional but they are what makes the pages read like
documentation instead of a gallery. Use them.

## Design system

Tokens and type scale: `src/index.css`. Component styles: `src/App.css`,
organised by section with a table of contents at the top.

- **Type**: Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono
  (micro-labels, numbers). Self-hosted via `@fontsource`, so no external requests.
- **Rules, not shadows**: sections are separated by hairlines; the only shadow is
  on the mobile menu.
- **Mono micro-labels** (`.eyebrow`, 11px, `.14em` tracking, uppercase) label
  everything: Focus, Timeline, the `01 / 02 / 03` block numbers, stats.
- **Theme**: follows the operating system until the visitor uses the toggle, then
  remembers the choice in `localStorage`.

## Smoke test

Checks what a build cannot: console errors, horizontal overflow, that the display
font actually applied, and that each route rendered real content.

```bash
npm run build
npx vite preview --port 4180
node scripts/smoke.mjs          # add --shots to write screenshots to /tmp/portfolio-shots
```

It drives the Chrome already installed on the machine through `puppeteer-core`
(no browser download), at desktop / tablet / mobile widths.

Two more diagnostics, both run against the same preview server:

```bash
node scripts/check-visuals.mjs     # per-route media counts, header spacing, hero band,
                                   # one-line rows, gallery layout
node scripts/check-collisions.mjs  # gallery frames reserve their space before media
                                   # loads, and text plates stay opaque
```

`check-collisions.mjs` blocks every image and video request and re-measures: if a
gallery frame collapses, the gallery's `w`/`h` data is missing or the EXIF
orientation was not applied. It also asserts the stats and spec-grid plates are
opaque, so the page's background grid cannot run behind their text.
