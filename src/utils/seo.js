import { SITE } from './site'

export function getSiteUrl() {
  const fromEnv = import.meta.env.VITE_SITE_URL
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

function upsertMeta(key, content, attr = 'name') {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function buildLocalBusinessJsonLd() {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoPartsStore',
    name: SITE.name,
    description: SITE.seo.defaultDescription,
    url: siteUrl || undefined,
    telephone: SITE.phoneMobileIntl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address,
      addressLocality: 'Fès',
      addressRegion: 'Fès-Meknès',
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.coordinates.lat,
      longitude: SITE.coordinates.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
    image: siteUrl ? `${siteUrl}/logo.png` : '/logo.png',
    sameAs: SITE.socialLinks.map((link) => link.href),
  }
}

export function applySeo({
  title,
  description,
  keywords,
  image,
  pathname = typeof window !== 'undefined' ? window.location.pathname : '/',
  noindex = false,
  jsonLd,
}) {
  const siteUrl = getSiteUrl()
  const pageTitle = title || SITE.seo.defaultTitle
  const fullTitle = title && title !== SITE.seo.defaultTitle ? `${title} | ${SITE.name}` : pageTitle
  const pageDescription = description || SITE.seo.defaultDescription
  const pageKeywords = keywords || SITE.seo.keywords
  const canonical = siteUrl ? `${siteUrl}${pathname}` : undefined
  const imagePath = image || SITE.seo.defaultImage
  const ogImage = imagePath.startsWith('http') ? imagePath : siteUrl ? `${siteUrl}${imagePath}` : imagePath

  document.title = fullTitle

  upsertMeta('description', pageDescription)
  upsertMeta('keywords', pageKeywords)
  upsertMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow')
  upsertMeta('author', SITE.name)
  upsertMeta('geo.region', 'MA-FES')
  upsertMeta('geo.placename', 'Fès')

  if (canonical) upsertLink('canonical', canonical)

  upsertMeta('og:title', fullTitle, 'property')
  upsertMeta('og:description', pageDescription, 'property')
  upsertMeta('og:type', 'website', 'property')
  upsertMeta('og:locale', 'fr_MA', 'property')
  upsertMeta('og:site_name', SITE.name, 'property')
  if (canonical) upsertMeta('og:url', canonical, 'property')
  upsertMeta('og:image', ogImage, 'property')

  upsertMeta('twitter:card', 'summary_large_image')
  upsertMeta('twitter:title', fullTitle)
  upsertMeta('twitter:description', pageDescription)
  upsertMeta('twitter:image', ogImage)

  let script = document.getElementById('seo-jsonld')
  if (jsonLd) {
    if (!script) {
      script = document.createElement('script')
      script.id = 'seo-jsonld'
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(jsonLd)
  } else if (script) {
    script.remove()
  }
}

export const STATIC_PAGE_SEO = {
  '/': {
    title: 'Fes Pièces Auto — Vente & Import de Pièces Automobiles à Fès',
    description:
      'Fes Pièces Auto : vente et import de pièces automobiles à Fès. Freinage, filtres, huiles, batteries VARTA, bougies NGK. Livraison Fès, Sefrou, Meknès. Contact WhatsApp.',
    jsonLd: true,
  },
  '/categories': {
    title: 'Catégories de pièces auto',
    description:
      'Parcourez toutes nos catégories de pièces automobiles à Fès : freinage, filtres, huiles, démarrage, outillage, nettoyage et plus.',
  },
  '/sous-categories': {
    title: 'Sous-catégories de pièces auto',
    description:
      'Découvrez nos sous-catégories de pièces auto à Fès. Trouvez la référence qu\'il vous faut et contactez-nous sur WhatsApp.',
  },
  '/a-propos': {
    title: 'À propos — Magasin de pièces auto à Fès',
    description:
      'Fes Pièces Auto à Mont Fleuri, Route de Sefrou. Vente et import de pièces automobiles, conseil expert, livraison à Fès et région.',
  },
  '/recherche': {
    title: 'Recherche de pièces auto',
    description: 'Recherchez une pièce automobile dans notre catalogue à Fès. Résultats par catégorie et sous-catégorie.',
  },
  '/favoris': {
    title: 'Mes favoris',
    description: 'Vos catégories et sous-catégories favorites — Fes Pièces Auto.',
    noindex: true,
  },
}
