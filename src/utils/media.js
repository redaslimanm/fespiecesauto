export function getApiBase() {
  if (import.meta.env.VITE_API_URL) {
    return String(import.meta.env.VITE_API_URL).replace(/\/$/, '')
  }

  // Dev (incl. ngrok): Vite proxies /api and /uploads to Express.
  if (import.meta.env.DEV) {
    return ''
  }

  return `${window.location.protocol}//${window.location.hostname}:${
    import.meta.env.VITE_API_PORT || 4000
  }`
}

/** URLs d'upload API : localhost ne marche pas sur mobile WiFi. */
export function resolveMediaUrl(url) {
  if (!url) return ''

  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url)) {
    return `${getApiBase()}${url.replace(/^https?:\/\/[^/]+/, '')}`
  }

  if (url.startsWith('/uploads/')) {
    return `${getApiBase()}${url}`
  }

  return url
}
