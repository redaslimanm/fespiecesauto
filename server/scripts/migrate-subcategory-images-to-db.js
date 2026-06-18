/**
 * Migre les images des sous-catégories (fichiers /uploads/ et URLs externes) vers la BDD.
 * Usage: node server/scripts/migrate-subcategory-images-to-db.js
 */
import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '..', '.env') })

function subcategoryImageApiPath(categorySlug, slug) {
  return `/api/subcategories/${categorySlug}/${slug}/image`
}

const UPLOADS_DIR = join(__dirname, '..', 'uploads')

const MIME_BY_EXT = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
}

function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return ''
  return url.trim().replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, '')
}

function mimeFromPath(filePath) {
  const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase()
  return MIME_BY_EXT[ext] || 'application/octet-stream'
}

async function loadImageBuffer(imageUrl) {
  const normalized = normalizeImageUrl(imageUrl)
  if (!normalized) return null

  if (normalized.startsWith('/uploads/')) {
    const filePath = join(UPLOADS_DIR, basename(normalized))
    if (!existsSync(filePath)) {
      console.warn(`  Fichier manquant: ${filePath}`)
      return null
    }
    return {
      buffer: readFileSync(filePath),
      mime: mimeFromPath(filePath),
    }
  }

  if (/^https?:\/\//i.test(normalized)) {
    const response = await fetch(normalized)
    if (!response.ok) {
      console.warn(`  Téléchargement échoué (${response.status}): ${normalized}`)
      return null
    }
    const buffer = Buffer.from(await response.arrayBuffer())
    const mime = response.headers.get('content-type')?.split(';')[0]?.trim() || 'image/jpeg'
    return { buffer, mime }
  }

  return null
}

async function ensureColumns(pool) {
  const [cols] = await pool.execute(`SHOW COLUMNS FROM subcategories LIKE 'image_data'`)
  if (cols.length) return
  await pool.execute('ALTER TABLE subcategories ADD COLUMN image_data MEDIUMBLOB NULL AFTER image')
  await pool.execute('ALTER TABLE subcategories ADD COLUMN image_mime VARCHAR(127) NULL AFTER image_data')
  console.log('Colonnes image_data / image_mime ajoutées.')
}

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'autopiecesfes',
  })

  await ensureColumns(pool)
  await pool.execute('SET SESSION max_allowed_packet = 67108864')

  const [rows] = await pool.execute(
    `SELECT category_slug, slug, image, image_mime
     FROM subcategories
     WHERE image IS NOT NULL AND image != ''
       AND (image_mime IS NULL OR image_mime = '')`
  )

  console.log(`Sous-catégories à migrer: ${rows.length}`)

  let migrated = 0
  let skipped = 0
  let failed = 0

  for (const row of rows) {
    const imageUrl = normalizeImageUrl(row.image)
    if (!imageUrl || imageUrl.startsWith('/api/subcategories/')) {
      skipped += 1
      continue
    }

    try {
      const loaded = await loadImageBuffer(imageUrl)
      if (!loaded) {
        failed += 1
        continue
      }

      const apiPath = subcategoryImageApiPath(row.category_slug, row.slug)
      await pool.execute(
        'UPDATE subcategories SET image_data = ?, image_mime = ?, image = ? WHERE category_slug = ? AND slug = ?',
        [loaded.buffer, loaded.mime, apiPath, row.category_slug, row.slug]
      )
      migrated += 1
      console.log(`  OK ${row.category_slug}/${row.slug}`)
    } catch (err) {
      failed += 1
      console.warn(`  Erreur ${row.category_slug}/${row.slug}: ${err.message}`)
    }
  }

  const [stats] = await pool.execute(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN image_mime IS NOT NULL AND image_mime != '' THEN 1 ELSE 0 END) AS inDb
     FROM subcategories`
  )

  console.log(`\nMigrées: ${migrated}, ignorées: ${skipped}, échecs: ${failed}`)
  console.log(`Images en BDD: ${stats[0].inDb}/${stats[0].total}`)

  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
