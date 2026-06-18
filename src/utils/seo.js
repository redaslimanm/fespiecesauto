import { SITE } from './site'
import { categoriesIndexPath, categoryPath, productPath, subcategoryPath } from './routes'
import { resolveMediaUrl } from './media'

export function getSiteUrl() {
  const fromEnv = import.meta.env.VITE_SITE_URL
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return 'https://fespiecesauto.ma'
}

export function absoluteUrl(path) {
  if (!path) return undefined
  if (/^https?:\/\//i.test(path)) return path
  const siteUrl = getSiteUrl()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return siteUrl ? `${siteUrl}${normalized}` : normalized
}

function upsertMeta(key, content, attr = 'name') {
  if (content == null || content === '') return
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

/** @typedef {'home' | 'category' | 'product' | 'default' | 'full'} TitleTemplate */

export function formatPageTitle(title, template = 'default') {
  switch (template) {
    case 'home':
      return 'Pièces Auto à Fès | FesPiecesAuto'
    case 'category':
      return title ? `${title} | Pièces Auto à Fès` : 'Pièces Auto à Fès | FesPiecesAuto'
    case 'product':
      return title ? `${title} | FesPiecesAuto` : SITE.seo.defaultTitle
    case 'full':
      return title || SITE.seo.defaultTitle
    default:
      return title ? `${title} | ${SITE.brandName}` : SITE.seo.defaultTitle
  }
}

export function buildLocalBusinessJsonLd() {
  const siteUrl = getSiteUrl()
  return {
    '@type': 'AutoPartsStore',
    name: SITE.brandName,
    description: SITE.seo.defaultDescription,
    url: siteUrl,
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
    image: absoluteUrl(SITE.seo.defaultImage),
    sameAs: SITE.socialLinks.map((link) => link.href),
  }
}

export function buildBreadcrumbJsonLd(items) {
  const siteUrl = getSiteUrl()
  const list = [
    { label: 'Accueil', path: '/' },
    ...items.filter((item) => item.label),
  ]

  return {
    '@type': 'BreadcrumbList',
    itemListElement: list.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.path ? absoluteUrl(item.path) : undefined,
    })),
  }
}

export function buildCategoryJsonLd({ category }) {
  return {
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description || `${category.name} — pièces auto à Fès`,
    url: absoluteUrl(categoryPath(category.slug)),
  }
}

export function buildSubcategoryJsonLd({ category, subcategory }) {
  return {
    '@type': 'CollectionPage',
    name: subcategory.name,
    description:
      subcategory.description || `${subcategory.name} — ${category.name} à Fès`,
    url: absoluteUrl(subcategoryPath(category.slug, subcategory.slug)),
    isPartOf: {
      '@type': 'CollectionPage',
      name: category.name,
      url: absoluteUrl(categoryPath(category.slug)),
    },
  }
}

export function buildProductJsonLd({ product, category, subcategory }) {
  const images = (product.images ?? [])
    .map((img) => absoluteUrl(resolveMediaUrl(img)))
    .filter(Boolean)

  return {
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} — pièce auto à Fès`,
    image: images.length ? images : undefined,
    sku: product.reference || product.slug,
    brand: {
      '@type': 'Brand',
      name: SITE.brandName,
    },
    category: [category?.name, subcategory?.name].filter(Boolean).join(' › '),
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'MAD',
      url: absoluteUrl(productPath(product.slug)),
      seller: {
        '@type': 'AutoPartsStore',
        name: SITE.brandName,
        url: getSiteUrl(),
      },
    },
  }
}

export function mergeJsonLd(schemas) {
  const list = schemas.filter(Boolean)
  if (!list.length) return undefined
  if (list.length === 1) return { '@context': 'https://schema.org', ...list[0] }
  return {
    '@context': 'https://schema.org',
    '@graph': list,
  }
}

export function categorySeoDescription(category) {
  if (category.description) {
    return `${category.description} Découvrez ${category.name} chez FesPiecesAuto à Fès. Contact rapide via WhatsApp.`
  }
  return `${category.name} : pièces automobiles à Fès. Large choix, conseil expert et contact WhatsApp chez FesPiecesAuto.`
}

export function productSeoDescription(product) {
  return `${product.name} disponible chez FesPiecesAuto à Fès. Référence, compatibilité véhicule et demande rapide via WhatsApp.`
}

export function applySeo({
  title,
  titleTemplate = 'default',
  description,
  keywords,
  image,
  pathname = typeof window !== 'undefined' ? window.location.pathname : '/',
  noindex = false,
  ogType = 'website',
  jsonLd,
}) {
  const fullTitle = formatPageTitle(title, titleTemplate)
  const pageDescription = description || SITE.seo.defaultDescription
  const pageKeywords = keywords || SITE.seo.keywords
  const canonical = absoluteUrl(pathname)
  const imagePath = image || SITE.seo.defaultImage
  const ogImage = absoluteUrl(
    imagePath.startsWith('http') || imagePath.startsWith('/') ? resolveMediaUrl(imagePath) : imagePath
  )

  document.title = fullTitle
  document.documentElement.lang = 'fr'

  upsertMeta('description', pageDescription)
  upsertMeta('keywords', pageKeywords)
  upsertMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow')
  upsertMeta('author', SITE.brandName)
  upsertMeta('geo.region', 'MA-FES')
  upsertMeta('geo.placename', 'Fès')

  upsertLink('canonical', canonical)

  upsertMeta('og:title', fullTitle, 'property')
  upsertMeta('og:description', pageDescription, 'property')
  upsertMeta('og:type', ogType, 'property')
  upsertMeta('og:locale', 'fr_MA', 'property')
  upsertMeta('og:site_name', SITE.brandName, 'property')
  upsertMeta('og:url', canonical, 'property')
  upsertMeta('og:image', ogImage, 'property')

  upsertMeta('twitter:card', 'summary_large_image')
  upsertMeta('twitter:title', fullTitle)
  upsertMeta('twitter:description', pageDescription)
  upsertMeta('twitter:image', ogImage)

  document.querySelectorAll('script[data-seo-jsonld]').forEach((node) => node.remove())

  if (jsonLd) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo-jsonld', 'true')
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)
  }
}

export const STATIC_PAGE_SEO = {
  '/': {
    titleTemplate: 'home',
    description:
      'Découvrez un large choix de pièces automobiles à Fès : batteries, filtres, freinage, suspension, éclairage et plus encore. Contact rapide via WhatsApp.',
    jsonLd: true,
  },
  '/categories': {
    title: 'Catégories de pièces auto',
    description:
      'Parcourez toutes nos catégories de pièces automobiles à Fès : freinage, filtres, huiles, batteries, éclairage et plus. FesPiecesAuto.',
  },
  '/sous-categories': {
    title: 'Sous-catégories de pièces auto',
    description:
      'Découvrez nos sous-catégories de pièces auto à Fès. Trouvez la référence qu\'il vous faut et contactez FesPiecesAuto sur WhatsApp.',
  },
  '/a-propos': {
    title: 'À propos',
    description:
      'FesPiecesAuto à Mont Fleuri, Route de Sefrou, Fès. Vente et import de pièces automobiles, conseil expert, livraison à Fès et région.',
    jsonLd: true,
  },
  '/recherche': {
    title: 'Recherche de pièces auto',
    description:
      'Recherchez une pièce automobile dans notre catalogue à Fès. Résultats par catégorie, sous-catégorie et produit.',
  },
  '/favoris': {
    title: 'Mes favoris',
    description: 'Vos catégories et sous-catégories favorites — FesPiecesAuto.',
    noindex: true,
  },
}
