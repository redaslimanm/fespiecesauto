export function getApiBase() {
  return ''
}

export function subcategoryImageUrl(categorySlug, subSlug) {
  const params = new URLSearchParams({
    categorySlug,
    subSlug,
  })
  return `/api/subcategory-image.php?${params}`
}

export function isApiSubcategoryImage(url) {
  if (!url) return false
  return (
    url.startsWith('/api/subcategories/') ||
    url.startsWith('/api/subcategory-image.php')
  )
}

/** URLs d'upload API : localhost ne marche pas sur mobile WiFi. */
export function resolveMediaUrl(url) {
  if (!url) return ''

  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url)) {
    return `${getApiBase()}${url.replace(/^https?:\/\/[^/]+/, '')}`
  }

  const legacyMatch = url.match(/^\/api\/subcategories\/([^/]+)\/([^/]+)\/image\/?$/)
  if (legacyMatch) {
    return `${getApiBase()}${subcategoryImageUrl(legacyMatch[1], legacyMatch[2])}`
  }

  if (
    url.startsWith('/uploads/') ||
    url.startsWith('/api/subcategory-image.php') ||
    url.startsWith('/api/subcategories/')
  ) {
    return `${getApiBase()}${url}`
  }

  return url
}
