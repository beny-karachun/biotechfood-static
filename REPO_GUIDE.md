# TechnionPrep — Repository Guide

> **Technion B.Sc. Biotechnology & Food Engineering** course companion — **Fully Static Site**
> Built with **Next.js 16 (Static Export) · TailwindCSS + shadcn/ui**

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, `output: 'export'`) |
| Language | TypeScript |
| Styling | TailwindCSS 3 + `tailwindcss-animate` |
| UI Library | shadcn/ui (Radix primitives) — 33 components |
| Animation | framer-motion |
| State / Forms | React Hook Form + Zod |
| Charts | Recharts |
| Theming | next-themes (dark / light / system) |
| i18n | Custom React Context — Hebrew (default) / English, persisted to `localStorage`, RTL/LTR aware |

---

## 2. Project Structure

```
biotechfood-static/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout (Header, Footer, ThemeProvider, LanguageProvider)
│   │   ├── page.tsx              # Home page (HeroSection + CourseDiagram)
│   │   ├── globals.css           # Global styles & CSS variables
│   │   ├── courses/
│   │   │   ├── page.tsx          # /courses — renders CourseDiagram
│   │   │   └── [courseName]/
│   │   │       ├── page.tsx      # Dynamic course page (pre-built via generateStaticParams)
│   │   │       └── CourseHtmlViewer.tsx  # Client: renders HTML/PDF in iframe
│   │   ├── calculator/
│   │   │   └── page.tsx          # Academic GPA calculator (localStorage)
│   │   └── tutoring/
│   │       └── page.tsx          # Tutoring info page (animated, bilingual)
│   ├── components/
│   │   ├── HeroSection.tsx       # Client: fullscreen video hero with CTA
│   │   ├── CourseDiagram.tsx     # Server: reads public/courses/ at build, passes data down
│   │   ├── AnimatedCourseGrid.tsx# Client: framer-motion 8-semester course grid
│   │   ├── CourseCard.tsx        # Reusable course card
│   │   ├── icons.tsx             # Icon definitions (WhatsApp, etc.)
│   │   ├── layout/
│   │   │   ├── Header.tsx        # Floating collapsible nav (theme, language, links)
│   │   │   └── Footer.tsx        # Site footer with copyright & links
│   │   └── ui/                   # 33 shadcn/ui components
│   ├── hooks/
│   │   ├── use-is-mobile.ts
│   │   ├── use-mobile.tsx
│   │   ├── use-theme.ts
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── i18n.tsx              # LanguageProvider / useLanguage() context
│   │   └── utils.ts             # cn() utility (clsx + tailwind-merge)
│   └── locales/
│       ├── en.json              # English translation dictionary
│       └── he.json              # Hebrew translation dictionary
├── public/
│   ├── courses/                  # Static HTML/PDF course content (41 course folders, ~196 HTML/PDF files)
│   ├── promo_video.mp4           # Hero section background video (~10 MB)
│   └── *.svg                     # SVG assets
├── docs/blueprint.md             # Original design blueprint (historical)
├── out/                          # ← Static build output (deploy this folder)
├── package.json
├── next.config.js                # output: 'export'
├── tailwind.config.ts
└── tsconfig.json
```

---

## 3. Key Pages

### Home (`/`)
- **HeroSection**: Full-screen video with CTA that smooth-scrolls to the course diagram.
- **CourseDiagram → AnimatedCourseGrid**: 8-semester grid. `CourseDiagram` is an async **server component** that scans `public/courses/` at build time to decide which courses are clickable, then hands the data to the `AnimatedCourseGrid` **client component** for rendering/animation. Courses can link to an internal viewer or an external URL.

### Course Detail (`/courses/[courseName]`)
- Pre-built at build time via `generateStaticParams`. Reads `public/courses/{slug}/` for `.html`/`.pdf` files.
- **CourseHtmlViewer** renders them in iframes with a PDF/HTML dropdown.

### Calculator (`/calculator`)
- GPA calculator with sortable course table and improvement-potential analysis.
- All data persisted to **localStorage** (no server needed).

### Tutoring (`/tutoring`)
- Animated, bilingual landing page describing tutoring services.

---

## 4. Internationalization (i18n)

- Implemented in [`src/lib/i18n.tsx`](src/lib/i18n.tsx) as a React Context (`LanguageProvider` / `useLanguage`).
- Dictionaries live in [`src/locales/`](src/locales/) (`en.json`, `he.json`); look up nested keys with `t('hero.title')`.
- Default language is **Hebrew**; the choice is saved to `localStorage` and document `dir`/`lang` is updated for RTL/LTR.

---

## 5. NPM Scripts

| Script | Command |
|---|---|
| `dev` | `next dev -p 9002` |
| `build` | `next build` → generates `out/` folder |
| `start` | `next start` |
| `lint` | `next lint` |
| `typecheck` | `tsc --noEmit` |

---

## 6. Deployment

The build produces a fully static `out/` directory. Deploy to **any** static host:

```bash
npm run build
# Deploy the out/ directory
```

---

## 7. Adding New Courses

1. Add a folder to `public/courses/` following the pattern `{courseNumber}-{sanitized-name}/`
2. Place `.html` and/or `.pdf` files inside
3. Run `npm run build` to regenerate the static site
