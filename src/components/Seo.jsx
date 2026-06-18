import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import {
  applySeo,
  buildLocalBusinessJsonLd,
  mergeJsonLd,
  STATIC_PAGE_SEO,
} from '../utils/seo'

export default function Seo({
  title,
  titleTemplate = 'default',
  description,
  keywords,
  image,
  noindex = false,
  ogType = 'website',
  jsonLd,
}) {
  const { pathname } = useLocation()

  const serializedLd = useMemo(
    () => (jsonLd ? JSON.stringify(jsonLd) : ''),
    [jsonLd]
  )

  useEffect(() => {
    applySeo({
      title,
      titleTemplate,
      description,
      keywords,
      image,
      pathname,
      noindex,
      ogType,
      jsonLd,
    })
  }, [
    title,
    titleTemplate,
    description,
    keywords,
    image,
    pathname,
    noindex,
    ogType,
    serializedLd,
    jsonLd,
  ])

  return null
}

export function RouteSeo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const config = STATIC_PAGE_SEO[pathname]
    if (!config) return

    applySeo({
      title: config.title,
      titleTemplate: config.titleTemplate ?? 'default',
      description: config.description,
      keywords: config.keywords,
      pathname,
      noindex: config.noindex,
      jsonLd: config.jsonLd
        ? mergeJsonLd([buildLocalBusinessJsonLd()])
        : undefined,
    })
  }, [pathname])

  return null
}
