# my-profile

我的个人简历相关资源：源 Markdown / PDF、以及用 **Vue 3 + TypeScript + Vite** 渲染的 A4 版式页面，便于在线浏览与导出 PDF。

## 项目结构

| 路径                     | 说明                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `src-profile/`           | 简历主源：`谢保龙简历.md`（以及本地 PDF 稿）；导出 `谢保龙简历-web.pdf` 也在此目录 |
| `src/data/resume.ts`     | 简历结构化数据；联系方式可带 `href`（与 PPT 中超链接一致），网页与导出 PDF 均可点击 |
| `src/data/resume-themes.ts` | 主题 id 列表与 `localStorage` 键名                                            |
| `src/components/resume/themes/` | 各主题独立壳组件（`ResumeTheme*.vue`）与对应 `resume-theme-*.css`（配色与版式微调） |
| `src/`                   | Vue 应用源码，入口 `src/main.ts`，简历视图 `src/views/ResumeView.vue`              |
| `public/resume-assets/`  | 从 PDF 抽出的头像、证书等静态资源                                                  |
| `scripts/export-pdf.mjs` | 使用 Playwright（Chromium）无头导出 PDF                                            |

## 环境要求

- **Node.js**：`^20.19.0` 或 `>=22.12.0`（见 `package.json` 的 `engines`）

## 安装依赖

```sh
npm install
```

首次若需使用 **导出 PDF** 脚本，需安装 Playwright 的 Chromium（仅需一次）：

```sh
npx playwright install chromium
```

## 常用命令

在项目根目录执行：

| 命令                      | 说明                                                            |
| ------------------------- | --------------------------------------------------------------- |
| `npm run dev`             | 本地开发，默认 <http://localhost:5173/>（若端口占用会自动顺延） |
| `npm run build`           | 类型检查 + 生产构建，产物在 `dist/`                             |
| `npm run preview`         | 预览构建结果（与导出 PDF 前使用的预览同源）                     |
| `npm run lint`            | 运行 Oxlint 与 ESLint                                           |
| `npm run export:pdf`      | 先 `build`，再启动临时 `vite preview`，用 Chromium 导出 PDF     |
| `npm run export:pdf:only` | 仅导出（需已有可用构建，一般先执行过 `npm run build`）          |

## 简历主题

页顶可切换多种主题（选择会写入浏览器 `localStorage`）：

| 主题     | 说明                                       |
| -------- | ------------------------------------------ |
| **经典** | 当前默认版式配色（青绿 + 绿条 + 紫条）     |
| **商务** | 冷灰配色；侧栏略窄、内边距更紧，经历条目间距略压缩 |
| **对开** | 双栏：左 `--folio-base` 侧栏；右侧技能 + 影响力（色均由该基色派生） |
| **简线** | 顶栏 + 双栏封面、技能标签、工作经历时间线；独立组件 `ResumeModularContent` |

带参打开（优先级高于 `localStorage`）：`/?theme=folio` 或 `/?theme=executive`（`classic` / `modular` 同理）。旧参数 `?theme=spectrum` 会自动映射为 `folio`；已移除的 `?theme=artistic` 会映射为 `classic`。

导出 PDF 时若需固定主题，可设置环境变量后执行 `export:pdf:only`：

```sh
RESUME_THEME=executive npm run export:pdf:only
```

有效值：`classic`、`executive`、`folio`、`modular`（`spectrum` 视为 `folio`；历史 `artistic` 视为 `classic`）。

## 导出 PDF

推荐使用脚本导出，版式由代码固定（A4、边距；Chromium 使用 `print` 媒体生成 PDF）：

```sh
npm run export:pdf
```

生成文件：**`src-profile/谢保龙简历-web.pdf`**。

## 技术栈

Vue 3（Composition API、`script setup`）、TypeScript、Vite、ESLint；导出 PDF 使用 [Playwright](https://playwright.dev/) 调用 Chromium 的 `page.pdf()`。

## 开发工具（可选）

建议使用 [VS Code](https://code.visualstudio.com/)，并安装 [Vue (Official) / Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)。更多 Vue + Vite 说明见 [Vite 文档](https://vite.dev/guide/) 与 [Vue 文档](https://vuejs.org/guide/)。
