import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const root = dirname(fileURLToPath(import.meta.url))

function getApiPort() {
  const envPath = join(root, 'server', '.env')
  if (!existsSync(envPath)) return 4000
  const match = readFileSync(envPath, 'utf8').match(/^PORT=(\d+)/m)
  return match ? Number(match[1]) : 4000
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
