import mysql from 'mysql2/promise'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', '..')

dotenv.config({ path: join(__dirname, '..', '.env') })

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'autopiecesfes',
})

const [rows] = await pool.execute(
  `SELECT COUNT(*) AS total,
          SUM(CASE WHEN image IS NOT NULL AND image != '' THEN 1 ELSE 0 END) AS withImage
   FROM subcategories`
)
console.log('DB:', rows[0])

const [byCat] = await pool.execute(
  `SELECT category_slug,
          COUNT(*) AS total,
          SUM(CASE WHEN image IS NOT NULL AND image != '' THEN 1 ELSE 0 END) AS withImage
   FROM subcategories
   GROUP BY category_slug
   ORDER BY category_slug`
)

for (const cat of byCat) {
  console.log(`${cat.category_slug}: ${cat.withImage}/${cat.total}`)
}

const subs = JSON.parse(readFileSync(join(root, 'src/data/subcategories.json'), 'utf8'))
let jsonTotal = 0
let jsonWith = 0
for (const arr of Object.values(subs)) {
  for (const s of arr) {
    jsonTotal += 1
    if (s.image) jsonWith += 1
  }
}
console.log(`JSON: ${jsonWith}/${jsonTotal} with image`)

const [uploadRows] = await pool.execute(
  `SELECT COUNT(*) AS count FROM subcategories WHERE image LIKE '/uploads/%'`
)
console.log('DB uploads paths in subcategories:', uploadRows[0].count)

const [productRows] = await pool.execute(`SELECT COUNT(*) AS count FROM products`)
console.log('Products in DB:', productRows[0].count)

await pool.end()
