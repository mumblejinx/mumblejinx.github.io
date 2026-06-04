# Jake Galm Portfolio — Complete Site Documentation

> This document describes every aspect of the Jake Galm / MumbleJinx portfolio website in enough detail that an AI or developer could recreate it from scratch.

---

## 1. Overview

This is the online portfolio of **Jake Galm**, a visual artist who works under the name **MumbleJinx**. The site presents his artwork across multiple categories, describes his practice and background, and provides a shop portal and a free-download section for Creative Commons-licensed work.

The project spans **two separate GitHub repositories**, each deployed independently to GitHub Pages:

| Site | Repo | URL |
|---|---|---|
| Main portfolio | `mumblejinx/mumblejinx.github.io` | `https://mumblejinx.github.io/` |
| Open Source art | `mumblejinx/opensource` | `https://mumblejinx.github.io/opensource/` |

---

## 2. Main Portfolio Site

### 2.1 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19.0.0 + TypeScript |
| Build tool | Vite 6.2.0 |
| CSS | Tailwind CSS 4.1.14 (via `@tailwindcss/vite` plugin) |
| Animation | Framer Motion (`motion` package v12) |
| Icons | Lucide React |
| Deployment | GitHub Actions → GitHub Pages (builds `dist/`, deploys to root) |

`package.json` scripts:
```json
"dev": "vite --port=3000 --host=0.0.0.0",
"build": "vite build",
"preview": "vite preview"
```

### 2.2 Repository Structure

```
mumblejinx-github/
├── index.html                        # Entry point (viewport-fit=cover set here)
├── vite.config.ts                    # Vite config with React + Tailwind plugins
├── src/
│   ├── main.tsx                      # React root mount
│   ├── App.tsx                       # Single root component, all layout logic
│   ├── constants.ts                  # Section/subsection enums
│   ├── index.css                     # @import "tailwindcss" + safe-area footer rule
│   └── components/
│       ├── AssetImage.tsx            # Image with text fallback
│       └── OrientationLock.tsx       # Portrait-only lock for phones
└── public/
    ├── jakegalm.jpg                  # Logo (top-left header)
    ├── work.jpg, about.jpg, support.jpg  # Top nav buttons
    ├── computer_intro.jpg            # Intro image shown on desktop
    ├── phone_intro.jpg               # Intro image shown on mobile
    ├── drip-one.png, drip-two.png, drip-three.png  # Animated drip decorations
    ├── analog.jpg, digital.jpg, street.jpg          # Work subsection buttons
    ├── projects.jpg, meander.jpg, source.jpg         # Work subsection buttons
    ├── word.jpg, rundown.jpg, contact.jpg            # About subsection buttons
    └── subsections/
        ├── analog.html
        ├── digital.html
        ├── street.html
        ├── projects.html
        ├── meander.html
        ├── source.html
        ├── word.html
        ├── contact.html
        ├── support.html
        ├── analog/        # analog thumbnail + full images
        ├── digital/       # digital thumbnail + full images
        ├── street/        # street thumbnail + full images
        └── projects/
            ├── list/      # project-1.jpg ... project-10.jpg, overview.jpg
            ├── project-1/ # IMG_3392.jpeg, IMG_3393.jpeg, IMG_3394.jpeg
            ├── project-2/ # 4 images
            ├── project-3/ # 5 images
            ├── project-4/ # 8 images
            ├── project-5/ # 7 PNG images
            ├── project-6/ # 8 images
            ├── project-7/ # link only, no images
            ├── project-8/ # 3 PNG images
            ├── project-9/ # 11 images
            └── project-10/ # 2 images
```

### 2.3 Constants — Sections and Subsections

`src/constants.ts`:
```typescript
export enum Section {
  INTRO = 'INTRO',
  WORK = 'WORK',
  ABOUT = 'ABOUT',
  SUPPORT = 'SUPPORT',
}

export enum WorkSubsection {
  ANALOG = 'ANALOG',
  DIGITAL = 'DIGITAL',
  PROJECTS = 'PROJECTS',
  STREET = 'STREET',
  MEANDER = 'MEANDER',
  SOURCE = 'SOURCE',
}

export enum AboutSubsection {
  WORD = 'WORD',
  RUNDOWN = 'RUNDOWN',
  CONTACT = 'CONTACT',
}

export type Subsection = WorkSubsection | AboutSubsection | null;
```

### 2.4 App State

`App.tsx` manages these state variables:

| State | Type | Purpose |
|---|---|---|
| `section` | `Section` | Which top-level section is active |
| `subsection` | `Subsection` | Which subsection within WORK or ABOUT |
| `animKey` | `number` | Incremented to re-trigger drip animations |
| `isExitingToIntro` | `boolean` | Prevents footer flicker during WORK→INTRO exit on mobile |
| `headerHeight` | `string` | `'52px'` on mobile, `'80px'` on desktop — drives animation |
| `lightbox` | `{images, index} \| null` | Global lightbox state, populated via postMessage from iframes |

### 2.5 Animation Architecture — The "Drip" System

This is the core visual mechanic of the site. There are **4 layers** stacked absolutely inside a `h-dvh` container:

**Layer 1 (z-10) — White Intro Background**
Always present behind everything. Shows the intro artwork image centered vertically, with `computer_intro.jpg` on desktop (`lg:`) and `phone_intro.jpg` on mobile.

**Layer 2 (z-20) — Black Content Panel**
An animated `motion.div` that expands downward:
- On INTRO: height = `headerHeight` (just covers the header bar)
- On any other section: height = `calc(100% - 120px)` (covers full viewport except bottom drip gap)
- Transition: 1.5s `easeInOut`

**Layer 3 (z-40) — Drip Bar**
An animated `motion.div` that moves its `top` position in sync with Layer 2:
- On INTRO: `top = headerHeight`
- On any other section: `top = calc(100% - 120px)`

The Drip Bar contains:
- A 10px light green bar (`#8bc34a`)
- A 10px dark green bar (`#2e7d32`)
- Three drip PNG images positioned absolutely, each with a drop animation (`y: -100 → 0`) triggered by `animKey` changes:
  - Drip One: `left-[8%]` mobile / `left-[11%]` desktop, duration 2.5s
  - Drip Two: `left-[65%]` mobile / `left-[80%]` desktop, duration 3s, delay 0.2s
  - Drip Three: `left-[82%]` mobile / `left-[88%]` desktop, duration 2.8s, delay 0.4s

**Layer 4 (z-30) — Content + Footer**
Contains the `<main>` area (iframe) and the `<footer>` (subsection navigation).

Content fades in with `opacity: 0 → 1` after a 1.5s delay (waiting for the black panel to finish descending).

### 2.6 Header

Fixed `absolute` header at top of screen:
- Black background, white text
- **Desktop (`lg:`):** 80px tall, centered nav with logo absolutely positioned left
- **Mobile:** auto height (~52px), logo left + nav fills remaining space
- Logo button: returns to INTRO section
- Nav buttons: WORK, ABOUT, SUPPORT — each uses `AssetImage` (real image or text fallback)

### 2.7 Footer / Bottom Navigation

Always visible at bottom of screen (`z-50`). Black background.
- On INTRO: shows nothing (empty bar)
- On WORK: shows 6 subsection buttons in 2 rows on mobile, 1 row on desktop:
  - Row 1: ANALOG, DIGITAL, PROJECTS
  - Row 2: STREET, MEANDER, SOURCE
  - Active subsection gets `ring-2 ring-[#8bc34a]` highlight
- On ABOUT: shows 3 subsection buttons: WORD, RUNDOWN, CONTACT
- On SUPPORT: shows nothing (the iframe fills the content area)

Each button uses `AssetImage` — shows image (`/analog.jpg` etc.) or text fallback.

### 2.8 Subsection Loading

When a non-INTRO section is active, content loads in an `<iframe>`:
```typescript
const getSubsectionFile = () => {
  if (section === Section.SUPPORT) return '/subsections/support.html';
  if (!subsection) return null;
  return `/subsections/${subsection.toLowerCase()}.html`;
};
```

URLs map to: `/subsections/analog.html`, `/subsections/word.html`, etc.

**Section defaults on first activation:**
- WORK → ANALOG
- ABOUT → WORD

### 2.9 Global Lightbox

The lightbox lives in the React app (parent), not in the iframes. Iframes trigger it via `postMessage`:

```javascript
// Inside any subsection iframe:
window.parent.postMessage({
  type: 'OPEN_LIGHTBOX',
  images: [{ full: '/path/to/image.jpg', description: 'text' }],
  index: 0
}, '*');
```

The app listens for this message and sets `lightbox` state.

Lightbox features:
- Full-screen black overlay (`bg-black/95`), `z-[100]`
- Left/right navigation arrows
- Keyboard navigation: ArrowLeft, ArrowRight, Escape
- Image fades in with scale animation (`opacity: 0, scale: 0.95 → 1`)
- Description panel (288px wide on desktop, full-width on mobile)
- Image counter (`1 / n`)
- Close button top-right

### 2.10 AssetImage Component

All navigation images use this component. It shows the real image file, and if the file is missing or fails to load, falls back to white uppercase text.

```typescript
<AssetImage src="/work.jpg" fallback="Work" className="h-5 lg:h-8" />
```

This means the site is fully functional even before any images are placed in `public/`.

### 2.11 OrientationLock Component

Detects phones (≤767px, coarse pointer, not tablet) in landscape orientation and shows a fullscreen black overlay with a "Rotate Device" message and a bouncing rotated smartphone icon.

---

## 3. Responsive Design Rules

**Critical rule:** All layout breakpoints use `lg:` (1024px), NOT `md:` (768px). This ensures tablets get the mobile layout.

| Breakpoint | Behavior |
|---|---|
| < 1024px (mobile/tablet) | Single-column mobile layouts, smaller header, 2-row footer nav |
| ≥ 1024px (desktop) | Two-column layouts, 80px header, single-row footer nav |

**iOS/mobile height fix:** `h-screen`/`min-h-screen` are replaced with `h-dvh`/`min-h-dvh` in the React app (native Tailwind v4 classes). Standalone HTML subsections use custom CSS:
```css
.h-dvh-safe { height: 100vh; height: 100dvh; }
.min-h-dvh-safe { min-height: 100vh; min-height: 100dvh; }
```

**iPhone notch/Dynamic Island:** `viewport-fit=cover` in all viewport meta tags. Safe area inset:
```css
footer { padding-bottom: env(safe-area-inset-bottom, 0px); }
```

**Ultra-wide capping:** Desktop layouts in standalone HTML files use `max-w-[1600px] mx-auto w-full`.

---

## 4. Subsection HTML Files

Each subsection is a standalone HTML file loaded in an iframe. They all use the Tailwind CDN (`https://cdn.tailwindcss.com`) and include their own responsive layout.

**Common patterns across all subsection files:**
- `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">`
- Black background, white text, `#8bc34a` lime green accent
- Desktop div: `hidden lg:flex` (hidden below 1024px)
- Mobile div: `lg:hidden` (hidden at 1024px+)
- dvh-safe CSS classes in `<style>` block
- Inter or sans-serif font

---

### 4.1 ANALOG / DIGITAL / STREET (Gallery Pages)

These three files (`analog.html`, `digital.html`, `street.html`) are structurally identical.

**Desktop layout:** Two-column flex row
- Left (60%): 9-column CSS grid of thumbnail images
- Right (40%): Scrollable text with title and bilingual description

**Thumbnail grid (DO NOT CHANGE THIS LOGIC):**
The grid uses a deliberate placeholder cell pattern to achieve **3 rows of 7 thumbnails** centered within a 9-column grid:

```javascript
images.forEach((img, index) => {
  if (index % 7 === 0) {
    // Insert empty placeholder cell BEFORE every 7th image
    const emptyStart = document.createElement('div');
    emptyStart.className = "aspect-[3/4]";
    grid.appendChild(emptyStart);
  }
  // ... append image cell ...
  if (index % 7 === 6 || index === images.length - 1) {
    // Insert empty placeholder cell AFTER every 7 images
    const emptyEnd = document.createElement('div');
    emptyEnd.className = "aspect-[3/4]";
    grid.appendChild(emptyEnd);
  }
});
```

Result per row: `[empty][img][img][img][img][img][img][img][empty]` = 9 columns.

**21 images total** (3 rows × 7).

Image behavior:
- Thumbnails load from `/subsections/[type]/[type]_thumb/[type]-N.jpg`
- Full images from `/subsections/[type]/[type]_full/[type]-N.jpg`
- Default grayscale, hover removes grayscale + slight zoom-out
- Click opens global lightbox via `window.parent.postMessage`
- Fade-in on load via IntersectionObserver

**Mobile layout:** Vertical stack of full-size images followed by text.

**Bounce scroll indicator:** Fixed bottom-left animated arrow, fades out on scroll.

---

### 4.2 PROJECTS

**Desktop layout:** Two-column flex row
- Left (50%): Vertically centered project image + navigation arrows (← counter →)
- Right (50%): Scrollable title + description

**Data structure (in `<script>`):**
```javascript
const projects = [
  {
    id: 0,                                    // 0 = overview
    title: "PROJECTS / プロジェクト",
    description: `<p>HTML string...</p>`,     // straight quotes only — NO smart quotes
    listImage: "/subsections/projects/list/overview.jpg",
    gallery: []                               // empty = no lightbox
  },
  {
    id: 1,
    title: "Falling Up 01",
    description: `<p>...purchase <a href="..." target="_blank" style="color:#8bc34a">here</a>.</p>`,
    listImage: "/subsections/projects/list/project-1.jpg",
    gallery: [
      "/subsections/projects/project-1/IMG_3392.jpeg",
      // ...
    ]
  },
  // ... projects 2-10
];
```

**⚠️ CRITICAL:** All strings in this file must use straight ASCII quotes (`"` and `'`), never smart/curly quotes (`"`, `"`, `'`, `'`). Smart quotes cause a JavaScript `SyntaxError: illegal character` that blanks the entire page.

**Navigation:** `prevProject()` / `nextProject()` cycle through the array. Counter shows `OVERVIEW` for id=0, `N / 10` for others.

**Gallery trigger:** Clicking the list image calls `openGallery(index)` which sends a `OPEN_LIGHTBOX` postMessage to the parent. Projects with empty `gallery: []` show default cursor and do nothing on click.

**Mobile layout:** Vertical stack of all project list images, then overview text below.

**External links per project:**
| Project | Link | Placement |
|---|---|---|
| 1 — Falling Up 01 | https://a.co/d/02F3nSeV | "here" in both EN/JP |
| 2 — Tenderfoot Wanderlust 01 | https://a.co/d/0el3CWyM | "here" in both EN/JP |
| 3 — Tenderfoot Wanderlust 02 | https://a.co/d/01QyRih6 | "here" in both EN/JP |
| 4 — SwampWalk | https://www.discogs.com/release/15868665-Swampwalk-Kids-Like-Me | "Kids Like Me" text |
| 5 — Artist Portfolio Video | https://www.youtube.com/watch?v=FOSYm6aFqg0 | "here" in both EN/JP |
| 6 — SLAP STARS | https://bridgemoguraeditions.com/products/global-only-slap-stars-trading-cards-tokyo-edition-box-copy | "SLAP STARS Tokyo Edition" text |
| 7 — Sticker Movie | https://stickermovie.com/ | "here" in both EN/JP |
| 8 — Showcase of Street Art | https://www.youtube.com/watch?v=Bk3z_aKAWtI | "here" in both EN/JP |

---

### 4.3 MEANDER / SOURCE

Identical structure. Two-column desktop layout (50/50):
- Left: large image with hover zoom effect
- Right: scrollable title and description text

SOURCE (`source.html`) links to `https://mumblejinx.github.io/opensource/` — the separate Open Source site — both as a clickable image and inline text links.

---

### 4.4 WORD (About/Concept)

Two-column desktop layout (40/60):
- Left (40%): centered artwork image
- Right (60%): scrollable text

Content: Bilingual (English + Japanese) artist statement. Describes Jake's background (raised in St. Charles, Michigan), his artistic evolution from 1997 "Bubblegum Cubist Surrealism" to current "Psychedelic Rhythm and Blues," and his influences (Michael Parkes, Van Gogh, Picasso, Modigliani, comics, anime).

---

### 4.5 RUNDOWN

Placeholder (not yet fully built out). Same structure as MEANDER/SOURCE.

---

### 4.6 CONTACT

Two-column desktop layout (40/60):
- Left (40%): contact artwork image
- Right (60%): intro text + Formspree contact form + social icons

**Form:** `action="https://formspree.io/f/xbdqvaoz"` method POST. Fields: email, message textarea, send button.

**Social icons:** Instagram, YouTube, Facebook, LinkedIn — all currently `href="#"` (not yet wired up). Icons are `.jpg` images from `/subsections/contact/`.

**Mobile:** Form first, image below.

---

### 4.7 SUPPORT

**Structure:** Not a two-column layout. Three large module cards (full-height on mobile, 3-column grid on desktop ≥1024px) + a text section below.

**Module cards:**
| Module | Label | Link |
|---|---|---|
| ETSY | MODULE_01 // SHOP | `#` (not yet set up — pending Etsy account) |
| AMAZON | MODULE_02 // LOGISTICS | Amazon search: `https://www.amazon.com/s?k=jake+galm&i=stripbooks-intl-ship...` |
| THREADLESS | MODULE_03 // APPAREL | `https://mumblejinx.threadless.com/` |

**Module styling:**
- Default: black background, `#8bc34a` SVG icon, white title
- Hover: `#8bc34a` background, black text, icon scales 1.1×
- Bottom-right action text slides up on hover
- Two decorative 4px dots (opacity 0.2) positioned center-left and center-right

**Media query:** `@media (min-width: 1024px)` switches from 1-column to 3-column grid.

**Does NOT use Tailwind CDN** — uses plain CSS only.

---

## 5. Color Palette

| Name | Hex | Usage |
|---|---|---|
| Lime green (primary) | `#8bc34a` | Headings, accent borders, hover states, active indicators, links |
| Dark green | `#2e7d32` | Lower drip bar stripe |
| Black | `#000000` / `#050505` | Backgrounds |
| Near-black | `#111111` | Card backgrounds |
| Dark border | `#222222` | Borders throughout |
| White | `#ffffff` | Text, intro background |
| Gray text | `#9ca3af` (gray-400) | Secondary text |

---

## 6. Open Source Art Site

### 6.1 Tech Stack

Same as the main portfolio: React + TypeScript + Vite + Tailwind CSS. Uses `framer-motion` and `react-router-dom`.

Deployed from repo `mumblejinx/opensource` to `https://mumblejinx.github.io/opensource/`.

### 6.2 Routes

```typescript
<Routes>
  <Route path="/opensource/" element={<HomePage />} />
  <Route path="/opensource/:projectId" element={<ProjectPage />} />
</Routes>
```

### 6.3 Data Model (`src/constants.ts`)

```typescript
export interface ArtworkFile {
  label: string;
  pdfFilename: string;
  pngFilename: string;
  preview?: string;          // .jpg thumbnail path (served from GitHub)
  pdfArchiveId?: string;     // override if PDF lives in a different Archive.org item
}

export interface ArtworkZip {
  label: string;
  filename: string;
}

export interface Artwork {
  id: string;
  archiveId: string;         // Archive.org item identifier
  title: string;
  description: string;       // English
  descriptionJp: string;     // Japanese
  image: string;             // Hero image path (served from GitHub)
  files: ArtworkFile[];
  zips: ArtworkZip[];
}
```

### 6.4 Archive.org File Hosting

**All downloadable PDF and PNG files are hosted on Archive.org**, not on GitHub Pages. This offloads all large-file bandwidth from the portfolio's GitHub Pages hosting.

Download URLs are built in `ProjectPage.tsx`:
```typescript
const ARCHIVE_BASE = 'https://archive.org/download';
const pdfUrl = `${ARCHIVE_BASE}/${file.pdfArchiveId ?? artwork.archiveId}/${file.pdfFilename}`;
const pngUrl = `${ARCHIVE_BASE}/${artwork.archiveId}/${file.pngFilename}`;
// Zip:
href={`${ARCHIVE_BASE}/${artwork.archiveId}/${zip.filename}`}
```

**Archive.org item mapping:**
| Project ID | Archive.org Item ID |
|---|---|
| seattle-stickers | `seattle-stickers-mumblejinx` |
| seattle-shouts | `seattle-shouts-mumblejinx` |
| super-sheroes | `supersheroes-mumblejinx` |
| trump | `trump-artfiles` |
| stickortreat | `stickortreat-mumblejinx` |
| gawain | `gawain-mumblejinx` |
| tv-week | `tv-week-pdfs` |
| manic-art | `manic-art-mumblejinx` |
| outkast | `outkast-mumblejinx` |
| bookking | `bookking-mumblejinx` |
| coloring-book | `coloring-mumblejinx` |

**Special case:** `angelica_jones.pdf` (standard print) in the `super-sheroes` project is in its own item `angelica_jones-mumblejinx` due to a separate upload. Its `ArtworkFile` entry has `pdfArchiveId: "angelica_jones-mumblejinx"`.

Preview `.jpg` thumbnail images ARE served from GitHub Pages (they are small and don't impact bandwidth).

### 6.5 HomePage

- Sticky nav with "OSA" logo block, GALLERY / ABOUT / LICENSE anchor links, "MAIN SITE" link back to portfolio
- Hero: large `FREE ART / FOR / EVERYONE` heading with `GlitchText` effect on "EVERYONE"
- `Marquee` component (scrolling text strip)
- Grid of `ArtCard` components: 1 col → 2 col → 3 col → 4 col responsive
- About section
- License section (Permitted / Prohibited / Attribution)
- Footer

### 6.6 ArtCard Component

Each card:
- Links to `/opensource/:projectId`
- Shows hero image in `aspect-[4/3]` container
- On hover: cycles through preview images every 1200ms, removes grayscale, shows dot indicators
- Shows title, English description, Japanese description below

### 6.7 ProjectPage

Individual project page at `/opensource/:projectId`.

- Sticky nav with back button
- Hero: project title (large uppercase) + bilingual description
- Full-width hero image
- Download grid: 1–4 columns responsive, each `FileCard` shows preview + PDF button + PNG button
- ZIP bundle section at bottom
- License reminder

**File cards:** PDF and PNG download buttons, both using HTML `download` attribute pointing to Archive.org.

---

## 7. Deployment

Both sites deploy via GitHub Actions on every push to `main`.

**Workflow** (`.github/workflows/deploy.yml` in each repo):
1. Checkout repo
2. Set up Node.js 24
3. `npm install`
4. `npm run build` (Vite outputs to `dist/`)
5. Upload `dist/` as GitHub Pages artifact
6. Deploy to GitHub Pages

**Build time:** approximately 2–3 minutes end-to-end after push.

---

## 8. Known Issues / Constraints

1. **Smart quotes will break JavaScript.** Any text in the `projects.html` `<script>` block must use straight ASCII quotes (`"` `'`), never typographic curly quotes (`"` `"` `'` `'`). These cause `SyntaxError: illegal character`.

2. **Subsection files are NOT processed by Vite.** They live in `public/` and are copied as-is to `dist/`. They cannot use TypeScript, JSX, or `import.meta`. They must be self-contained HTML.

3. **Tailwind CDN in iframes.** Subsection files load Tailwind from `https://cdn.tailwindcss.com`. This means breakpoint classes work, but Tailwind v4 native features like `h-dvh` are NOT available in subsection files — instead, custom CSS classes `.h-dvh-safe` and `.min-h-dvh-safe` are used.

4. **Lightbox communication is one-way.** Iframes post messages up to the parent; the parent cannot push state down to iframes (other than by reloading the src).

5. **Etsy not yet connected.** The Etsy module in `support.html` links to `#`. Awaiting Etsy shop setup.

6. **RUNDOWN subsection is a stub.** The RUNDOWN about subsection exists in the nav but the HTML content is placeholder text only.

7. **9-column gallery grid must not be changed.** The placeholder cell logic in `analog.html`, `digital.html`, and `street.html` is an intentional artistic design creating 3 rows of 7 images. Do not replace with CSS `auto-fill` or any fluid grid approach.

---

## 9. Artist Background (for content context)

- **Name:** Jake Galm, alias MumbleJinx
- **Origin:** St. Charles, Michigan (small town, one stoplight)
- **Lived in:** St. Louis, Los Angeles, Seattle, Pittsburgh, South Carolina; also Netherlands, Japan, England, France, Peru
- **Style origin:** 1997, self-described "Bubblegum Cubist Surrealism"; now "Psychedelic Rhythm and Blues"
- **Influences:** Michael Parkes, Van Gogh, Picasso, Modigliani, cartoons, comics, OMNI magazine covers, anime, hip hop
- **Media:** Colored pencil with black ink (analog); paper → ink → scan → digital color (digital); street art/sticker collage (street)
- **Language:** Bilingual content throughout — English and Japanese

---

## 10. Recreating the Site from Scratch

### Minimum viable portfolio (main site)

1. Scaffold: `npm create vite@latest -- --template react-ts`
2. Install: `motion`, `@tailwindcss/vite`, `tailwindcss`, `lucide-react`
3. Configure Tailwind via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed)
4. Add `viewport-fit=cover` to `index.html`
5. Add `footer { padding-bottom: env(safe-area-inset-bottom, 0px); }` to `index.css`
6. Create `src/constants.ts` with Section/WorkSubsection/AboutSubsection enums
7. Build `App.tsx` with the 4-layer stacking system described in §2.5
8. Build `AssetImage.tsx` (image with text fallback)
9. Build `OrientationLock.tsx` (landscape warning for phones)
10. Create `public/subsections/` with standalone HTML files for each subsection
11. Configure GitHub Actions for Pages deployment

### Key design decisions to preserve
- The black panel descending animation is the site's primary identity — preserve the 1.5s easeInOut timing
- All breakpoints at `lg:` (1024px), never `md:` (768px)
- Lime green `#8bc34a` is the only accent color — used for headings, active states, hover states
- Iframes isolate each section's HTML/CSS from the React app
- The lightbox lives in the React parent and is triggered via postMessage

---

*Generated: 2026-06-05*
