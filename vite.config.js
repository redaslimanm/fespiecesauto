import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const root = dirname(fileURLToPath(import.meta.url))

function getApiPort() {
  const envPaths = [
    join(root, '.env.local'),
    join(root, 'server', '.env'),
  ]
  for (const envPath of envPaths) {
    if (!existsSync(envPath)) continue
    const match = readFileSync(envPath, 'utf8').match(/^PORT=(\d+)/m)
    if (match) return Number(match[1])
  }
  return 3000
}

const apiTarget = `http://127.0.0.1:${getApiPort()}`

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', '.ngrok.io'],
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
      '/uploads': { target: apiTarget, changeOrigin: true },
    },
  },
})
