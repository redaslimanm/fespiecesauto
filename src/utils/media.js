export function getApiBase() {
  // Always use relative URLs (/api/...) — works on Vercel, nginx, and Vite dev proxy.
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
