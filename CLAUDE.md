# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server (auto-ports if 5173 busy) |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run lint` | Oxlint + ESLint (both auto-fix) |
| `npm run export:pdf` | Build + export PDF via Playwright headless Chromium → `src-profile/谢保龙简历-web.pdf` |
| `npm run export:pdf:only` | Export PDF only (requires existing build), optionally `RESUME_THEME=executive npm run export:pdf:only` |
| `npm run preview` | Preview production build |
| `npx playwright install chromium` | One-time setup for PDF export |

## Architecture

**Stack**: Vue 3 (Composition API, `<script setup>`), TypeScript, Vite, plain CSS (no framework)

### Entry & Rendering

`src/main.ts` → `App.vue` → `ResumeView.vue`

No router — single page app. Resume data is hardcoded in `src/data/resume.ts` (`ResumeData` type).

### Theme System

Four themes: `classic`, `executive`, `folio`, `artistic`. Theme is persisted to `localStorage` (`my-profile-resume-theme`) and can be overridden via `?theme=` query param.

**Theme shell + CSS variable bridge**:

Each theme has a pair of files in `src/components/resume/themes/`:
- `ResumeTheme<Name>.vue` — renders `<div class="resume-shell theme-<name>"><slot /></div>`
- `resume-theme-<name>.css` — maps theme-specific colors to shared CSS variables (`--resume-teal`, `--resume-green`, `--resume-purple`, `--resume-ink`, `--resume-muted`, `--resume-canvas`, `--resume-shell-radial`, `--resume-page-elevation`)

These variables are consumed by `ResumeView.vue`'s scoped styles and the theme's own content component.

**Two rendering paths** (in `ResumeView.vue` line 119):

| Theme | Content component | Layout |
|---|---|---|
| classic, executive, folio | Shared template inside `ResumeView.vue` (7-page layout with cover portrait + work/early/cert pages) | CSS overrides adjust spacing/colors |
| artistic | `ResumeArtisticContent.vue` (completely independent component) | Own multi-page layout, no shared template |

**Theme shells are mapped** in `src/components/resume/themes/themeShells.ts` — `RESUME_THEME_SHELLS` record keyed by `ResumeThemeId`. `ResumeView.vue` uses `<component :is="themeShell">` to switch shells dynamically.

Theme IDs and labels are defined in `src/data/resume-themes.ts`. Legacy `spectrum` maps to `folio`.

### CSS Strategy

- `src/assets/base.css` — Vue color palette, body defaults, dark mode
- `src/assets/main.css` — `#app` and link styles
- `ResumeView.vue` scoped styles — shared page layout for classic/executive/folio (A4 pages, `.page-cover`, `.page-work`, `.page-certificates`)
- Theme CSS files — color variables only (mostly); executive/folio also override layout variables
- `ResumeArtisticContent.vue` scoped styles — self-contained art-theme layout

### PDF Export

`scripts/export-pdf.mjs`:
1. Spawns `vite preview` on port 4179
2. Launches headless Chromium via Playwright
3. Loads `http://127.0.0.1:4179/?theme=<theme>` (defaults to `classic`, controlled by `RESUME_THEME` env var)
4. Switches to `print` media emulation
5. Calls `page.pdf()` with A4, `preferCSSPageSize: true`, zero margins

The `@media print` rules in both `ResumeView.vue` and `ResumeArtisticContent.vue` handle:
- Removing box-shadows and background colors
- Fixing page dimensions to 210mm × 296mm
- Hiding the theme switcher bar
- Removing link underlines

### Key TypeScript Types (`src/types/resume.ts`)

`ResumeData` contains: `name`, `headlineLines`, `summaryLines`, `contactItems` (with optional `href`), `skillGroups`, `influenceItems`, `workExperiences`/`earlyExperiences` (title, period, role, result, bullets), `certificateImages`, `portraitSrc`/`portraitAlt`.

### Static Assets

- `public/resume-assets/` — portrait, certificate images
- `public/ppt-assets/` — SVG icons for contact methods, skill headings, section headers
