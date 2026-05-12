# my-profile

我的个人简历相关资源：源 Markdown / PDF、以及用 **Vue 3 + TypeScript + Vite** 渲染的 A4 版式页面，便于在线浏览与导出 PDF。

## 项目结构

| 路径                     | 说明                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `src-profile/`           | 简历源文件：`谢保龙简历.md`、`谢保龙简历.pdf`，以及脚本导出的 `谢保龙简历-web.pdf` |
| `src/`                   | Vue 应用源码，入口 `src/main.ts`，简历页面在 `src/views/ResumeView.vue`            |
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

## 导出 PDF

推荐使用脚本导出，版式由代码固定（A4、边距、`print` 媒体），与浏览器「打印 → 另存为 PDF」相比更稳定：

```sh
npm run export:pdf
```

生成文件：**`src-profile/谢保龙简历-web.pdf`**。

若仅需在浏览器中手动打印，可在 `npm run dev` 打开的页面使用打印功能，并注意关闭多余页眉页脚、开启背景图形、边距选「无」或最小。

## 技术栈

Vue 3（Composition API、`script setup`）、TypeScript、Vite、ESLint；导出 PDF 使用 [Playwright](https://playwright.dev/) 调用 Chromium 的 `page.pdf()`。

## 开发工具（可选）

建议使用 [VS Code](https://code.visualstudio.com/)，并安装 [Vue (Official) / Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)。更多 Vue + Vite 说明见 [Vite 文档](https://vite.dev/guide/) 与 [Vue 文档](https://vuejs.org/guide/)。
