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

Four themes: `classic`, `executive`, `folio`, `modular`. Theme is persisted to `localStorage` (`my-profile-resume-theme`) and can be overridden via `?theme=` query param. Legacy URL/storage values `spectrum` → `folio`, `artistic` → `classic` (see `normalizeThemeParam` in `src/data/resume-themes.ts`).

**Theme shell + CSS variable bridge**:

Each theme has a pair of files in `src/components/resume/themes/`:
- `ResumeTheme<Name>.vue` — renders `<div class="resume-shell theme-<name>"><slot /></div>`
- `resume-theme-<name>.css` — maps theme-specific colors to shared CSS variables (`--resume-teal`, `--resume-green`, `--resume-purple`, `--resume-ink`, `--resume-muted`, `--resume-canvas`, `--resume-shell-radial`, `--resume-page-elevation`)

These variables are consumed by `ResumeView.vue`'s scoped styles and the theme's own content component.

**Two rendering paths** (in `ResumeView.vue`):

| Theme | Content component | Layout |
|---|---|---|
| classic, executive, folio | Shared template inside `ResumeView.vue` (8-page layout with cover portrait + work/early/cert pages) | CSS overrides adjust spacing/colors |
| modular | `ResumeModularContent.vue`（顶栏 + 双栏封面 + 时间线经历 + 证书；`workChunks` 仍由 `ResumeView` 测量） | `resume-theme-modular.css` 仅 `--resume-*` 变量 |

**Theme shells are mapped** in `src/components/resume/themes/themeShells.ts` — `RESUME_THEME_SHELLS` record keyed by `ResumeThemeId`. `ResumeView.vue` uses `<component :is="themeShell">` to switch shells dynamically.

Theme IDs and labels are defined in `src/data/resume-themes.ts`. Legacy: `spectrum` → `folio`; removed theme `artistic` → `classic`.

### CSS Strategy

- `src/assets/base.css` — Vue color palette, body defaults, dark mode
- `src/assets/main.css` — `#app` and link styles
- `ResumeView.vue` scoped styles — shared page layout for classic/executive/folio (A4 pages, `.page-cover`, `.page-work`, `.page-certificates`)
- Theme CSS files — color variables only (mostly); executive/folio also override layout variables

### Page Layout Constraints

- **简历页面不出现滚动条**（屏上预览与组件样式一致）：`ResumeModularContent.vue` 内分页容器、双栏与时间线体使用 `overflow-y: hidden`（必要时内容由固定 A4 裁切）；勿改回 `overflow-y: auto`。详见 `.cursor/rules/resume-no-scrollbars.mdc`。

- **Classic / executive / folio**（`ResumeView.vue` 的 `.page`）：屏上 `min-height: 297mm` 可增高；打印 `min-height: 296mm`，Inspire 经历由 JS 按可视高度分包（见下节）。

- **Modular（简线）**（`ResumeModularContent.vue`）：独立多页；封面为顶栏 + 双栏（**左**：个人总结、公司经历、影响力；**右**：基本信息、技能标签）；经历与早期为**左侧竖线 + 节点圆点**时间线；`workChunks` 与经典主题同源（隐藏测量区仍在 `ResumeView.vue`）。主题色见 `resume-theme-modular.css` 中 `--resume-*`；**强制 A4** 单页固定高、无页内滚动条。

- Decorative geometry (`.page::after`, `.cover-corner`, `.page-cover::before`, `.decor-top` / `.decor-left`) **renders in print/PDF** so Playwright export matches on-screen layout (`printBackground: true` in `scripts/export-pdf.mjs`).

### Work Experience Pagination

**Shared template** (classic/executive/folio): Inspire 工作经历不再手写固定 `slice`；`ResumeView.vue` 用 **隐藏测量区**（`.work-chunk-measure`）在 `297mm` 高的 `.page-work` 内堆叠全部条目，量出每条 `offsetHeight + margin-bottom`；首包按 **非 compact** 高度预算，后续包按 **compact** 预算；`packWorkExperienceChunks`（`src/utils/packResumeWorkChunks.ts`）**贪心**塞满一页再放下一页，单条超高则独占一页。`resize` / `beforeprint` / `fonts.ready` / `resume.workExperiences` 变化会触发重算。

| Page # | Section | 内容 | Modifier |
|--------|---------|------|----------|
| 1 | Cover | portrait, skills, contact, influence | `.page-cover` |
| 2… | Inspire work | `workChunks`（动态长度） | 首页 `.page-work`，后续 `.compact` |
| *+1* | Early | `earlySectionTitle` + `earlyExperiences` | `.page-work.compact.page-early` |
| *+2* | Certificates | `certificateImages` | `.page-certificates` |

页码：封面 `1`，工作经历 `2 + chunkIndex`，早期 `2 + workChunks.length`，证书 `3 + workChunks.length`。

- **Section title placement (PDF / print)**：每个 Inspire chunk 仍各自以 teal `workSectionTitle` 开头；早期页 **不要** 再叠一条 Inspire 标题（该页无 Inspire 正文）。

### PDF Export

`scripts/export-pdf.mjs`:
1. Spawns `vite preview` on port 4179
2. Launches headless Chromium via Playwright
3. Loads `http://127.0.0.1:4179/?theme=<theme>` (defaults to `classic`, controlled by `RESUME_THEME` env var)
4. Switches to `print` media emulation
5. Calls `page.pdf()` with A4, `preferCSSPageSize: true`, zero margins

The `@media print` rules in `ResumeView.vue` (shared pages) and `ResumeModularContent.vue` (简线) handle:
- Removing box-shadows on pages (flat paper)
- Classic/folio: `min-height: 296mm` on `.page`; modular: **fixed** `height/min/max: 296mm` on `.page-modular`
- Hiding the theme switcher bar
- Removing link underlines

### Key TypeScript Types (`src/types/resume.ts`)

`ResumeData` contains: `name`, `headlineLines`, `summaryLines`, `contactItems` (with optional `href`), `skillGroups`, `influenceItems` (`string` 或 `InfluenceGroup` 嵌套子列表), `workExperiences`/`earlyExperiences` (title, period, role, result, bullets), `certificateImages`, `portraitSrc`/`portraitAlt`.

### Static Assets

- `public/resume-assets/` — portrait, certificate images
- `public/ppt-assets/` — SVG icons for contact methods, skill headings, section headers
