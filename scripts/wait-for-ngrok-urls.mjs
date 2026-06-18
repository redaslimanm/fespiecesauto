import { fileURLToPath } from 'node:url'
import { detectPorts } from './detect-ports.mjs'

const NGROK_API = 'http://127.0.0.1:4040/api/tunnels'
const MAX_ATTEMPTS = 30
const DELAY_MS = 1000

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchTunnels() {
  const response = await fetch(NGROK_API)
  if (!response.ok) throw new Error(`ngrok API returned ${response.status}`)
  return response.json()
}

function pickTunnelUrl(tunnels, port) {
  const matches = (tunnels ?? []).filter((entry) => {
    const configAddr = String(entry.config?.addr ?? '')
    return (
      configAddr === String(port) ||
      configAddr.endsWith(`:${port}`) ||
      configAddr.includes(`localhost:${port}`) ||
      configAddr.includes(`127.0.0.1:${port}`)
    )
  })

  const https = matches.find((entry) => entry.public_url?.startsWith('https://'))
  return (https ?? matches[0])?.public_url ?? null
}

export async function waitForNgrokUrls() {
  const { webPort, apiPort } = detectPorts()

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const data = await fetchTunnels()
      const webUrl = pickTunnelUrl(data.tunnels ?? [], webPort)
      const apiUrl = pickTunnelUrl(data.tunnels ?? [], apiPort)

      if (webUrl) {
        return { webUrl, apiUrl: apiUrl ?? null, webPort, apiPort }
      }
    } catch {
      // ngrok may not be ready yet
    }

    await sleep(DELAY_MS)
  }

  throw new Error(
    'Timed out waiting for ngrok tunnel. Ensure ngrok is running and the Vite dev server is up.',
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  waitForNgrokUrls()
    .then((urls) => {
      console.log(JSON.stringify(urls, null, 2))
    })
    .catch((error) => {
      console.error(error.message)
      process.exit(1)
    })
}
