/**
 * Migre les données SQLite existantes vers MySQL.
 * Usage: npm run migrate:sqlite (depuis server/)
 */
import { DatabaseSync } from 'node:sqlite'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '..', '.env') })

const SQLITE_FILE = join(__dirname, '..', 'data', 'autopieces.db')

async function main() {
  if (!existsSync(SQLITE_FILE)) {
    console.error('Fichier SQLite introuvable:', SQLITE_FILE)
    process.exit(1)
  }

  const sqlite = new DatabaseSync(SQLITE_FILE)
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'autopiecesfes',
  })

  const schema = readFileSync(join(__dirname, '..', 'schema.sql'), 'utf-8')
  const statements = schema
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('--') && !s.toUpperCase().startsWith('USE '))

  for (const statement of statements) {
    if (statement.toUpperCase().includes('CREATE DATABASE')) {
      const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
      })
      await conn.query(statement)
      await conn.end()
    } else {
      await pool.query(statement)
    }
  }

  const categories = sqlite.prepare('SELECT * FROM categories').all()
  const subcategories = sqlite.prepare('SELECT * FROM subcategories').all()
  const users = sqlite.prepare('SELECT * FROM users').all()
  const products = sqlite.prepare('SELECT * FROM products').all()

  console.log(
    `SQLite: ${categories.length} catégories, ${subcategories.length} sous-catégories, ${users.length} utilisateurs, ${products.length} produits`
  )

  await pool.query('SET FOREIGN_KEY_CHECKS = 0')
  await pool.query('TRUNCATE TABLE products')
  await pool.query('TRUNCATE TABLE subcategories')
  await pool.query('TRUNCATE TABLE users')
  await pool.query('TRUNCATE TABLE categories')
  await pool.query('SET FOREIGN_KEY_CHECKS = 1')

  for (const row of categories) {
    await pool.execute(
      'INSERT INTO categories (slug, name, description, image, icon_png) VALUES (?, ?, ?, ?, ?)',
      [row.slug, row.name, row.description ?? '', row.image ?? '', row.icon_png ?? '']
    )
  }

  for (const row of subcategories) {
    await pool.execute(
      'INSERT INTO subcategories (slug, category_slug, name, description, image) VALUES (?, ?, ?, ?, ?)',
      [
        row.slug,
        row.category_slug,
        row.name,
        row.description ?? '',
        row.image ?? '',
      ]
    )
  }

  for (const row of users) {
    await pool.execute(
      'INSERT INTO users (id, name, email, password_hash, salt, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        row.id,
        row.name,
        row.email,
        row.password_hash,
        row.salt,
        row.role,
        row.created_at,
      ]
    )
  }

  for (const row of products) {
    await pool.execute(
      `INSERT INTO products (slug, name, reference, description, category_slug, subcategory_slug, images, compatibility, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        row.slug,
        row.name,
        row.reference ?? '',
        row.description ?? '',
        row.category_slug,
        row.subcategory_slug,
        row.images ?? '[]',
        row.compatibility ?? '[]',
        row.featured ? 1 : 0,
      ]
    )
  }

  await pool.end()
  console.log('Migration terminée avec succès vers MySQL.')
}

main().catch((err) => {
  console.error('Erreur migration:', err.message)
  process.exit(1)
})
