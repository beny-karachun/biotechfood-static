# TechnionPrep — Repository Guide

> **Technion B.Sc. Biotechnology & Food Engineering** course companion — **Fully Static Site**
> Built with **Next.js 15 (Static Export) · TailwindCSS + shadcn/ui**

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, `output: 'export'`) |
| Language | TypeScript |
| Styling | TailwindCSS 3 + `tailwindcss-animate` |
| UI Library | shadcn/ui (Radix primitives) — 33 components |
| State / Forms | React Hook Form + Zod |
| Charts | Recharts |
| Theming | next-themes (dark / light / system) |

---

## 2. Project Structure

```
studio-master/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout (Header, Footer, ThemeProvider)
│   │   ├── page.tsx              # Home page (HeroSection + CourseDiagram)
│   │   ├── globals.css           # Global styles & CSS variables
│   │   ├── courses/
│   │   │   ├── page.tsx          # /courses — renders CourseDiagram
│   │   │   └── [courseName]/
│   │   │       ├── page.tsx      # Dynamic course page (pre-built via generateStaticParams)
│   │   │       └── CourseHtmlViewer.tsx  # Client: renders HTML/PDF in iframe
│   │   └── calculator/
│   │       └── page.tsx          # Academic GPA calculator (localStorage)
│   ├── components/
│   │   ├── HeroSection.tsx       # Client: fullscreen video hero with CTA
│   │   ├── CourseDiagram.tsx     # Server: 8-semester course grid (reads filesystem at build)
│   │   ├── CourseCard.tsx        # Reusable course card
│   │   ├── icons.tsx             # Icon definitions (WhatsApp, etc.)
│   │   ├── layout/
│   │   │   ├── Header.tsx        # Floating collapsible nav (theme, links)
│   │   │   └── Footer.tsx        # Site footer with copyright & links
│   │   └── ui/                   # 33 shadcn/ui components
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-theme.ts
│   │   └── use-toast.ts
│   └── lib/
│       └── utils.ts              # cn() utility (clsx + tailwind-merge)
├── public/
│   ├── courses/                  # Static HTML/PDF course content (132 items)
│   ├── promo_video.mp4           # Hero section background video (~10 MB)
│   └── *.svg                     # SVG assets
├── out/                          # ← Static build output (deploy this folder)
├── package.json
├── next.config.js                # output: 'export'
├── tailwind.config.ts
└── tsconfig.json
```

---

## 3. Key Pages

### Home (`/`)
- **HeroSection**: Full-screen video with CTA that smooth-scrolls to course diagram.
- **CourseDiagram**: 8-semester grid. Courses with HTML files in `public/courses/` are clickable.

### Course Detail (`/courses/[courseName]`)
- Pre-built at build time via `generateStaticParams`. Reads `public/courses/{slug}/` for `.html`/`.pdf` files.
- **CourseHtmlViewer** renders them in iframes with PDF/HTML dropdown.

### Calculator (`/calculator`)
- GPA calculator with sortable course table, improvement potential analysis.
- All data persisted to **localStorage** (no server needed).

---

## 4. NPM Scripts

| Script | Command |
|---|---|
| `dev` | `next dev -p 9002` |
| `build` | `next build` → generates `out/` folder |
| `start` | `next start` |
| `lint` | `next lint` |
| `typecheck` | `tsc --noEmit` |

---

## 5. Deployment

The build produces a fully static `out/` directory. Deploy to **any** static host:

```bash
npm run build
# Deploy the out/ directory
```

---

## 6. Adding New Courses

1. Add a folder to `public/courses/` following the pattern `{courseNumber}-{sanitized-name}/`
2. Place `.html` and/or `.pdf` files inside
3. Run `npm run build` to regenerate the static site
