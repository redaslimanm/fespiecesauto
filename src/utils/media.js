export function getApiBase() {
  if (import.meta.env.VITE_API_URL) {
    return String(import.meta.env.VITE_API_URL).replace(/\/$/, '')
  }

  if (import.meta.env.VITE_API_PORT && typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:${import.meta.env.VITE_API_PORT}`
  }

  // Relative URLs — Vite dev proxy, Vercel, or nginx same-origin /api
  return ''
}

/** URLs d'upload API : localhost ne marche pas sur mobile WiFi. */
export function resolveMediaUrl(url) {
  if (!url) return ''

  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url)) {
    return `${getApiBase()}${url.replace(/^https?:\/\/[^/]+/, '')}`
  }

  if (url.startsWith('/uploads/') || url.startsWith('/api/subcategories/')) {
    return `${getApiBase()}${url}`
  }

  return url
}
