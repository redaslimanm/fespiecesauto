import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const siteUrl = (process.env.VITE_SITE_URL || 'https://fespiecesauto.ma').replace(/\/$/, '')
const categories = JSON.parse(readFileSync(join(root, 'src/data/categories.json'), 'utf-8'))
const subcategories = JSON.parse(readFileSync(join(root, 'src/data/subcategories.json'), 'utf-8'))

const staticPaths = ['/', '/categories', '/sous-categories', '/a-propos', '/recherche']

const urls = [...staticPaths]

for (const category of categories) {
  urls.push(`/categories/${category.slug}`)
  const subs = subcategories[category.slug] || []
  for (const sub of subs) {
    urls.push(`/categories/${category.slug}/${sub.slug}`)
  }
}

const today = new Date().toISOString().slice(0, 10)

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${siteUrl}${path === '/' ? '' : path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${path === '/' ? '1.0' : path.startsWith('/categories/') && path.split('/').length > 3 ? '0.6' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`

writeFileSync(join(root, 'public/sitemap.xml'), `${xml}\n`, 'utf-8')

const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /signup
Disallow: /favoris

Sitemap: ${siteUrl}/sitemap.xml
`

writeFileSync(join(root, 'public/robots.txt'), robots, 'utf-8')

console.log(`Generated sitemap with ${urls.length} URLs for ${siteUrl}`)
