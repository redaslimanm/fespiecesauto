import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', '..')

dotenv.config({ path: join(__dirname, '..', '.env') })

const CATEGORIES_FILE = join(root, 'src', 'data', 'categories.json')
const SUBCATEGORIES_FILE = join(root, 'src', 'data', 'subcategories.json')

async function main() {
  const categories = JSON.parse(readFileSync(CATEGORIES_FILE, 'utf-8'))
  const subcategoriesByCategory = JSON.parse(readFileSync(SUBCATEGORIES_FILE, 'utf-8'))
  const slugs = categories.map((c) => c.slug)

  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'autopiecesfes',
  })

  const placeholders = slugs.map(() => '?').join(', ')

  if (slugs.length) {
    await pool.execute(`DELETE FROM products WHERE category_slug NOT IN (${placeholders})`, slugs)
    await pool.execute(`DELETE FROM subcategories WHERE category_slug NOT IN (${placeholders})`, slugs)
    await pool.execute(`DELETE FROM categories WHERE slug NOT IN (${placeholders})`, slugs)
  } else {
    await pool.execute('DELETE FROM products')
    await pool.execute('DELETE FROM subcategories')
    await pool.execute('DELETE FROM categories')
  }

  for (const category of categories) {
    await pool.execute(
      `INSERT INTO categories (slug, name, description, image, icon_png)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description),
         image = VALUES(image), icon_png = VALUES(icon_png)`,
      [
        category.slug,
        category.name,
        category.description ?? '',
        category.image ?? '',
        category.iconPng ?? `/categories/icons/${category.slug}.png`,
      ]
    )
  }

  for (const categorySlug of slugs) {
    const subs = subcategoriesByCategory[categorySlug] ?? []
    const subSlugs = subs.map((s) => s.slug)

    if (subSlugs.length) {
      const subPlaceholders = subSlugs.map(() => '?').join(', ')
      await pool.execute(
        `DELETE FROM subcategories WHERE category_slug = ? AND slug NOT IN (${subPlaceholders})`,
        [categorySlug, ...subSlugs]
      )
    } else {
      await pool.execute('DELETE FROM subcategories WHERE category_slug = ?', [categorySlug])
    }

    for (const sub of subs) {
      await pool.execute(
        `INSERT INTO subcategories (slug, category_slug, name, description, image)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), image = VALUES(image)`,
        [sub.slug, categorySlug, sub.name, sub.description ?? '', sub.image ?? '']
      )
    }
  }

  const [catRows] = await pool.execute('SELECT COUNT(*) AS count FROM categories')
  const [subRows] = await pool.execute('SELECT COUNT(*) AS count FROM subcategories')
  console.log(`Synced ${catRows[0].count} categories and ${subRows[0].count} subcategories.`)

  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
