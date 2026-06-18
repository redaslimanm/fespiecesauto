/**
 * Convertit les URLs localhost en chemins relatifs /uploads/...
 * Usage: node scripts/fix-localhost-urls.js
 */
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '..', '.env') })

function stripLocalhost(url) {
  if (!url || typeof url !== 'string') return url
  return url.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, '')
}

const pool = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

await pool.execute(
  `UPDATE categories SET image = REPLACE(image, 'http://localhost:4000', '')
   WHERE image LIKE 'http://localhost:4000%'`
)
await pool.execute(
  `UPDATE subcategories SET image = REPLACE(image, 'http://localhost:4000', '')
   WHERE image LIKE 'http://localhost:4000%'`
)

const [products] = await pool.query('SELECT slug, images FROM products')
for (const row of products) {
  let images = row.images
  if (typeof images === 'string') images = JSON.parse(images)
  const fixed = images.map(stripLocalhost)
  await pool.execute('UPDATE products SET images = ? WHERE slug = ?', [
    JSON.stringify(fixed),
    row.slug,
  ])
}

const [subCount] = await pool.query(
  "SELECT COUNT(*) AS c FROM subcategories WHERE image LIKE '/uploads/%'"
)
console.log(`URLs corrigées. Sous-catégories avec /uploads/: ${subCount[0].c}`)
await pool.end()
