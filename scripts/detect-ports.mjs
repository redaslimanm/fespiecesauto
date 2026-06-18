import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const DEFAULT_WEB_PORT = 5173
const DEFAULT_API_PORT = 3000

function readEnvPort(envPath, key, fallback) {
  if (!existsSync(envPath)) return fallback
  const match = readFileSync(envPath, 'utf8').match(new RegExp(`^${key}=(\\d+)`, 'm'))
  return match ? Number(match[1]) : fallback
}

function readVitePort() {
  const viteConfigPath = join(root, 'vite.config.js')
  if (!existsSync(viteConfigPath)) return DEFAULT_WEB_PORT

  const source = readFileSync(viteConfigPath, 'utf8')
  const portMatch = source.match(/server\s*:\s*\{[\s\S]*?\bport\s*:\s*(\d+)/)
  return portMatch ? Number(portMatch[1]) : DEFAULT_WEB_PORT
}

export function detectPorts() {
  const apiPort = readEnvPort(join(root, '.env.local'), 'PORT', DEFAULT_API_PORT)
  const legacyApiPort = readEnvPort(join(root, 'server', '.env'), 'PORT', DEFAULT_API_PORT)
  const exampleApiPort = readEnvPort(
    join(root, '.env.local.example'),
    'PORT',
    DEFAULT_API_PORT,
  )
  const webPort = readVitePort()

  const resolvedApiPort = existsSync(join(root, '.env.local'))
    ? apiPort
    : existsSync(join(root, 'server', '.env'))
      ? legacyApiPort
      : exampleApiPort

  return {
    webPort,
    apiPort: resolvedApiPort,
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(detectPorts(), null, 2))
}
