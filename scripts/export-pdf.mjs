#!/usr/bin/env node
/**
 * 使用 Playwright（Chromium）导出简历为 PDF，避免浏览器「打印」对话框带来的缩放/边距差异。
 * 前置：npm run build，且已执行 npx playwright install chromium
 */
import { spawn } from 'node:child_process'
import net from 'node:net'
import { mkdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(__dirname, '..')
const outDir = resolve(appRoot, 'src-profile')
const outFile = join(outDir, '谢保龙简历-web.pdf')
const PORT = 4179
const BASE = `http://127.0.0.1:${PORT}`

function waitForPort(port, host = '127.0.0.1', timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs
  return new Promise((resolvePromise, reject) => {
    const tryConnect = () => {
      const socket = net.createConnection({ port, host }, () => {
        socket.end()
        resolvePromise()
      })
      socket.on('error', () => {
        if (Date.now() > deadline) {
          reject(new Error(`Timeout waiting for ${host}:${port}`))
        } else {
          setTimeout(tryConnect, 150)
        }
      })
    }
    tryConnect()
  })
}

async function main() {
  await mkdir(outDir, { recursive: true })

  const child = spawn(
    'npm',
    ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
    {
      cwd: appRoot,
      stdio: 'inherit',
      shell: true,
      env: { ...process.env },
    },
  )

  try {
    await waitForPort(PORT)
    await new Promise((r) => setTimeout(r, 400))

    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 120_000 })
    await page.emulateMedia({ media: 'print' })

    // Chromium 生成的 PDF 默认保留 <a href> 链接（在阅读器中可点）；无需单独选项
    await page.pdf({
      path: outFile,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      preferCSSPageSize: true,
    })

    await browser.close()
    console.log(`PDF 已写入: ${outFile}`)
  } finally {
    child.kill('SIGTERM')
    await new Promise((r) => setTimeout(r, 300))
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
