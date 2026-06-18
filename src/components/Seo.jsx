import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { applySeo, buildLocalBusinessJsonLd, STATIC_PAGE_SEO } from '../utils/seo'

export default function Seo({
  title,
  description,
  keywords,
  image,
  noindex = false,
  jsonLd,
}) {
  const { pathname } = useLocation()

  useEffect(() => {
    applySeo({
      title,
      description,
      keywords,
      image,
      pathname,
      noindex,
      jsonLd,
    })
  }, [title, description, keywords, image, pathname, noindex, jsonLd])

  return null
}

export function RouteSeo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const config = STATIC_PAGE_SEO[pathname]
    if (!config) return

    applySeo({
      title: config.title,
      description: config.description,
      keywords: config.keywords,
      pathname,
      noindex: config.noindex,
      jsonLd: config.jsonLd ? buildLocalBusinessJsonLd() : undefined,
    })
  }, [pathname])

  return null
}
