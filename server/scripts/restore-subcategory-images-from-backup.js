/**
 * Restaure les images des sous-catégories depuis la sauvegarde SQLite + uploads.
 * Usage: node server/scripts/restore-subcategory-images-from-backup.js
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..', '..')
const defaultBackupRoot = join(projectRoot, '..', 'New folder', 'autopiecesfes')

dotenv.config({ path: join(__dirname, '..', '.env') })

const BACKUP_ROOT = process.env.BACKUP_ROOT || defaultBackupRoot
const BACKUP_DB = join(BACKUP_ROOT, 'server', 'data', 'autopieces.db')
const BACKUP_UPLOADS = join(BACKUP_ROOT, 'server', 'uploads')
const TARGET_UPLOADS = join(__dirname, '..', 'uploads')

function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  return trimmed.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, '')
}

function extractUploadFilename(imageUrl) {
  const normalized = normalizeImageUrl(imageUrl)
  if (!normalized.startsWith('/uploads/')) return null
  return basename(normalized)
}

async function main() {
  if (!existsSync(BACKUP_DB)) {
    console.error('Backup SQLite not found:', BACKUP_DB)
    process.exit(1)
  }

  if (!existsSync(BACKUP_UPLOADS)) {
    console.error('Backup uploads folder not found:', BACKUP_UPLOADS)
    process.exit(1)
  }

  mkdirSync(TARGET_UPLOADS, { recursive: true })

  const sqlite = new DatabaseSync(BACKUP_DB)
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'autopiecesfes',
  })

  const backupRows = sqlite
    .prepare(
      `SELECT category_slug, slug, image
       FROM subcategories
       WHERE image IS NOT NULL AND image != ''`
    )
    .all()

  console.log(`Backup subcategories with image: ${backupRows.length}`)

  let updated = 0
  let skipped = 0
  let missingInMysql = 0
  const filesToCopy = new Set()

  for (const row of backupRows) {
    const image = normalizeImageUrl(row.image)
    if (!image) {
      skipped += 1
      continue
    }

    const [result] = await pool.execute(
      'UPDATE subcategories SET image = ? WHERE category_slug = ? AND slug = ?',
      [image, row.category_slug, row.slug]
    )

    if (result.affectedRows === 0) {
      missingInMysql += 1
      continue
    }

    updated += 1
    const filename = extractUploadFilename(image)
    if (filename) filesToCopy.add(filename)
  }

  let copied = 0
  let alreadyPresent = 0
  let copyMissing = 0

  for (const filename of filesToCopy) {
    const source = join(BACKUP_UPLOADS, filename)
    const target = join(TARGET_UPLOADS, filename)

    if (!existsSync(source)) {
      copyMissing += 1
      continue
    }

    if (existsSync(target)) {
      alreadyPresent += 1
      continue
    }

    copyFileSync(source, target)
    copied += 1
  }

  const backupUploadCount = readdirSync(BACKUP_UPLOADS).filter((f) =>
    /\.(png|jpe?g|webp|gif|svg)$/i.test(f)
  ).length
  const targetUploadCount = readdirSync(TARGET_UPLOADS).filter((f) =>
    /\.(png|jpe?g|webp|gif|svg)$/i.test(f)
  ).length

  const [stats] = await pool.execute(
    `SELECT COUNT(*) AS total,
            SUM(CASE WHEN image IS NOT NULL AND image != '' THEN 1 ELSE 0 END) AS withImage,
            SUM(CASE WHEN image LIKE '/uploads/%' THEN 1 ELSE 0 END) AS uploads
     FROM subcategories`
  )

  sqlite.close()
  await pool.end()

  console.log('')
  console.log('Restore complete')
  console.log(`  MySQL rows updated: ${updated}`)
  console.log(`  Skipped (empty image): ${skipped}`)
  console.log(`  Not found in MySQL: ${missingInMysql}`)
  console.log(`  Upload files copied: ${copied}`)
  console.log(`  Upload files already present: ${alreadyPresent}`)
  console.log(`  Upload files missing in backup: ${copyMissing}`)
  console.log(`  Backup uploads: ${backupUploadCount} | Current uploads: ${targetUploadCount}`)
  console.log(
    `  MySQL subcategories with image: ${stats[0].withImage}/${stats[0].total} (${stats[0].uploads} in /uploads/)`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
