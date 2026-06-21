import { cpSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const distDir = join(root, '..', 'dist')
const publicDir = join(root, '..', 'public')

if (!existsSync(distDir)) {
  console.error('dist/ not found — run vite build first')
  process.exit(1)
}

cpSync(distDir, publicDir, { recursive: true })
console.log('Copied dist/ → public/ (Vite SPA assets)')
