import mysql from 'mysql2/promise'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const SEED_FILE = join(process.cwd(), 'src', 'data', 'categories.json')
const SUBCATEGORIES_FILE = join(process.cwd(), 'src', 'data', 'subcategories.json')
const PRODUCTS_FILE = join(process.cwd(), 'src', 'data', 'products.json')

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'srv1746.hstgr.io',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'autopiecesfes',
  waitForConnections: true,
  connectionLimit: 10,
})

async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params)
  return rows
}

async function execute(sql, params = []) {
  const [result] = await pool.execute(sql, params)
  return result
}

function parseJson(value, fallback = []) {
  if (value == null) return fallback
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export async function initDatabase() {
  const dbName = process.env.DB_NAME || 'autopiecesfes'
  const bootstrap = await mysql.createConnection({
    host: process.env.DB_HOST || 'srv1746.hstgr.io',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  })
  await bootstrap.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  )
  await bootstrap.end()

  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      slug VARCHAR(191) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      image TEXT,
      icon_png TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS subcategories (
      slug VARCHAR(191) NOT NULL,
      category_slug VARCHAR(191) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      image TEXT,
      image_data MEDIUMBLOB,
      image_mime VARCHAR(127),
      PRIMARY KEY (category_slug, slug),
      FOREIGN KEY (category_slug) REFERENCES categories(slug) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await ensureSubcategoryImageColumns()

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL DEFAULT '',
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      salt VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'client',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      slug VARCHAR(191) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      reference VARCHAR(255) DEFAULT '',
      description TEXT,
      category_slug VARCHAR(191) NOT NULL,
      subcategory_slug VARCHAR(191) NOT NULL,
      images JSON NOT NULL,
      compatibility JSON NOT NULL,
      featured TINYINT(1) NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await seedIfEmpty()
  await seedSubcategories()
  await seedProducts()
  await seedAdmin()
}

async function ensureSubcategoryImageColumns() {
  const rows = await query(`SHOW COLUMNS FROM subcategories LIKE 'image_data'`)
  if (rows.length) return
  await pool.query('ALTER TABLE subcategories ADD COLUMN image_data MEDIUMBLOB NULL AFTER image')
  await pool.query('ALTER TABLE subcategories ADD COLUMN image_mime VARCHAR(127) NULL AFTER image_data')
}

export function subcategoryImageApiPath(categorySlug, slug) {
  return `/api/subcategories/${categorySlug}/${slug}/image`
}

function mapSubcategoryImage(row) {
  if (row.image_mime) {
    return subcategoryImageApiPath(row.category_slug, row.slug)
  }
  return row.image ?? ''
}

async function seedIfEmpty() {
  const rows = await query('SELECT COUNT(*) AS count FROM categories')
  const count = Number(rows[0]?.count ?? 0)
  if (count > 0 || !existsSync(SEED_FILE)) return

  let seed = []
  try {
    seed = JSON.parse(readFileSync(SEED_FILE, 'utf-8'))
  } catch {
    return
  }

  for (const category of seed) {
    await execute(
      'INSERT INTO categories (slug, name, description, image, icon_png) VALUES (?, ?, ?, ?, ?)',
      [
        category.slug,
        category.name,
        category.description ?? '',
        category.image ?? '',
        category.iconPng ?? `/categories/icons/${category.slug}.png`,
      ]
    )
  }
}

async function seedSubcategories() {
  if (!existsSync(SUBCATEGORIES_FILE)) return

  let seedByCategory = {}
  try {
    seedByCategory = JSON.parse(readFileSync(SUBCATEGORIES_FILE, 'utf-8'))
  } catch {
    return
  }

  for (const [categorySlug, subs] of Object.entries(seedByCategory)) {
    const exists = await query('SELECT 1 FROM categories WHERE slug = ? LIMIT 1', [categorySlug])
    if (!exists.length || !Array.isArray(subs)) continue

    for (const sub of subs) {
      await execute(
        `INSERT IGNORE INTO subcategories (slug, category_slug, name, description, image)
         VALUES (?, ?, ?, ?, ?)`,
        [sub.slug, categorySlug, sub.name, sub.description ?? '', sub.image ?? '']
      )
      await execute(
        'UPDATE subcategories SET name = ?, description = ? WHERE category_slug = ? AND slug = ?',
        [sub.name, sub.description ?? '', categorySlug, sub.slug]
      )
      if (sub.image) {
        if (categorySlug === 'freinage') {
          await execute(
            'UPDATE subcategories SET image = ? WHERE category_slug = ? AND slug = ?',
            [sub.image, categorySlug, sub.slug]
          )
        } else {
          await execute(
            'UPDATE subcategories SET image = ? WHERE category_slug = ? AND slug = ? AND (image IS NULL OR image = \'\')',
            [sub.image, categorySlug, sub.slug]
          )
        }
      }
    }
  }
}

async function seedProducts() {
  const rows = await query('SELECT COUNT(*) AS count FROM products')
  const count = Number(rows[0]?.count ?? 0)
  if (count > 0 || !existsSync(PRODUCTS_FILE)) return

  let seed = []
  try {
    seed = JSON.parse(readFileSync(PRODUCTS_FILE, 'utf-8'))
  } catch {
    return
  }

  for (const product of seed) {
    if (!product.slug || !product.name) continue
    await execute(
      `INSERT INTO products (slug, name, reference, description, category_slug, subcategory_slug, images, compatibility, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.slug,
        product.name,
        product.reference ?? '',
        product.description ?? '',
        product.categorySlug,
        product.subcategorySlug,
        JSON.stringify(product.images ?? []),
        JSON.stringify(product.compatibility ?? []),
        product.featured ? 1 : 0,
      ]
    )
  }
}

function hashPassword(password, salt) {
  return scryptSync(password, salt, 64).toString('hex')
}

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'otman@gmail.com').toLowerCase()
  const password = process.env.ADMIN_PASSWORD || 'otman2005'
  const name = process.env.ADMIN_NAME || 'Otman'

  const existing = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email])
  if (existing.length) return

  const salt = randomBytes(16).toString('hex')
  await execute(
    'INSERT INTO users (name, email, password_hash, salt, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, hashPassword(password, salt), salt, 'admin']
  )
}

function publicUser(user) {
  if (!user) return null
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export async function getUserByEmail(email) {
  const rows = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [
    String(email).toLowerCase(),
  ])
  return rows[0] ?? null
}

export async function createUser({ name, email, password }) {
  const salt = randomBytes(16).toString('hex')
  const result = await execute(
    'INSERT INTO users (name, email, password_hash, salt, role) VALUES (?, ?, ?, ?, ?)',
    [name, String(email).toLowerCase(), hashPassword(password, salt), salt, 'client']
  )
  const rows = await query('SELECT * FROM users WHERE id = ? LIMIT 1', [result.insertId])
  return publicUser(rows[0])
}

export async function verifyCredentials(email, password) {
  const user = await getUserByEmail(email)
  if (!user) return null
  const expected = Buffer.from(user.password_hash, 'hex')
  const actual = Buffer.from(hashPassword(password, user.salt), 'hex')
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
  return publicUser(user)
}

export async function getCategories() {
  const categories = await query('SELECT * FROM categories ORDER BY name')
  const subs = await query(
    'SELECT slug, category_slug, name, description, image, image_mime FROM subcategories ORDER BY name'
  )

  return categories.map((c) => ({
    id: c.slug,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    iconPng: c.icon_png,
    subcategories: subs
      .filter((s) => s.category_slug === c.slug)
      .map((s) => ({
        id: s.slug,
        name: s.name,
        slug: s.slug,
        description: s.description ?? '',
        image: mapSubcategoryImage(s),
      })),
  }))
}

export async function getCategory(slug) {
  const categories = await getCategories()
  return categories.find((c) => c.slug === slug) ?? null
}

export async function categoryExists(slug) {
  const rows = await query('SELECT 1 FROM categories WHERE slug = ? LIMIT 1', [slug])
  return rows.length > 0
}

export async function insertCategory({ slug, name, description, image, iconPng }) {
  await execute(
    'INSERT INTO categories (slug, name, description, image, icon_png) VALUES (?, ?, ?, ?, ?)',
    [slug, name, description, image, iconPng]
  )
  return await getCategory(slug)
}

export async function updateCategory(slug, fields) {
  const rows = await query('SELECT * FROM categories WHERE slug = ? LIMIT 1', [slug])
  const current = rows[0]
  if (!current) return null

  await execute('UPDATE categories SET name = ?, description = ?, image = ? WHERE slug = ?', [
    fields.name ?? current.name,
    fields.description ?? current.description,
    fields.image ?? current.image,
    slug,
  ])
  return await getCategory(slug)
}

export async function deleteCategory(slug) {
  await execute('DELETE FROM subcategories WHERE category_slug = ?', [slug])
  const result = await execute('DELETE FROM categories WHERE slug = ?', [slug])
  return result.affectedRows > 0
}

export async function subcategoryExists(categorySlug, slug) {
  const rows = await query(
    'SELECT 1 FROM subcategories WHERE category_slug = ? AND slug = ? LIMIT 1',
    [categorySlug, slug]
  )
  return rows.length > 0
}

export async function insertSubcategory(categorySlug, { slug, name, description = '', image = '' }) {
  await execute(
    'INSERT INTO subcategories (slug, category_slug, name, description, image) VALUES (?, ?, ?, ?, ?)',
    [slug, categorySlug, name, description, image]
  )
  return { id: slug, name, slug, description, image }
}

export async function getSubcategoryImage(categorySlug, slug) {
  const rows = await query(
    'SELECT image_data, image_mime FROM subcategories WHERE category_slug = ? AND slug = ? LIMIT 1',
    [categorySlug, slug]
  )
  const row = rows[0]
  if (!row?.image_data) return null
  return { data: row.image_data, mime: row.image_mime || 'application/octet-stream' }
}

export async function setSubcategoryImage(categorySlug, slug, buffer, mime) {
  const imageUrl = subcategoryImageApiPath(categorySlug, slug)
  const result = await execute(
    'UPDATE subcategories SET image_data = ?, image_mime = ?, image = ? WHERE category_slug = ? AND slug = ?',
    [buffer, mime, imageUrl, categorySlug, slug]
  )
  if (!result.affectedRows) return null
  return imageUrl
}

export async function clearSubcategoryImage(categorySlug, slug) {
  const result = await execute(
    'UPDATE subcategories SET image_data = NULL, image_mime = NULL, image = ? WHERE category_slug = ? AND slug = ?',
    ['', categorySlug, slug]
  )
  return result.affectedRows > 0
}

export async function updateSubcategory(categorySlug, slug, fields) {
  const rows = await query(
    'SELECT slug, name, description, image, image_mime FROM subcategories WHERE category_slug = ? AND slug = ? LIMIT 1',
    [categorySlug, slug]
  )
  const current = rows[0]
  if (!current) return null

  const name = fields.name ?? current.name
  const description = fields.description ?? current.description

  if (fields.image === undefined) {
    await execute(
      'UPDATE subcategories SET name = ?, description = ? WHERE category_slug = ? AND slug = ?',
      [name, description, categorySlug, slug]
    )
    return {
      id: slug,
      name,
      slug,
      description,
      image: mapSubcategoryImage({ ...current, category_slug: categorySlug }),
    }
  }

  const nextImage = fields.image.trim()
  if (!nextImage) {
    await execute(
      `UPDATE subcategories SET name = ?, description = ?, image = '', image_data = NULL, image_mime = NULL
       WHERE category_slug = ? AND slug = ?`,
      [name, description, categorySlug, slug]
    )
    return { id: slug, name, slug, description, image: '' }
  }

  if (nextImage.startsWith('/api/subcategories/')) {
    await execute(
      'UPDATE subcategories SET name = ?, description = ? WHERE category_slug = ? AND slug = ?',
      [name, description, categorySlug, slug]
    )
    return {
      id: slug,
      name,
      slug,
      description,
      image: mapSubcategoryImage({ ...current, category_slug: categorySlug }),
    }
  }

  await execute(
    `UPDATE subcategories SET name = ?, description = ?, image = ?, image_data = NULL, image_mime = NULL
     WHERE category_slug = ? AND slug = ?`,
    [name, description, nextImage, categorySlug, slug]
  )
  return { id: slug, name, slug, description, image: nextImage }
}

export async function deleteSubcategory(categorySlug, slug) {
  const result = await execute(
    'DELETE FROM subcategories WHERE category_slug = ? AND slug = ?',
    [categorySlug, slug]
  )
  return result.affectedRows > 0
}

function publicProduct(row) {
  if (!row) return null
  return {
    id: row.slug,
    name: row.name,
    slug: row.slug,
    reference: row.reference ?? '',
    description: row.description ?? '',
    categorySlug: row.category_slug,
    subcategorySlug: row.subcategory_slug,
    images: parseJson(row.images),
    compatibility: parseJson(row.compatibility),
    featured: Boolean(row.featured),
  }
}

export async function getProducts() {
  const rows = await query('SELECT * FROM products ORDER BY name')
  return rows.map(publicProduct)
}

export async function getProduct(slug) {
  const rows = await query('SELECT * FROM products WHERE slug = ? LIMIT 1', [slug])
  return publicProduct(rows[0])
}

export async function productExists(slug) {
  const rows = await query('SELECT 1 FROM products WHERE slug = ? LIMIT 1', [slug])
  return rows.length > 0
}

export async function insertProduct({
  slug,
  name,
  reference = '',
  description = '',
  categorySlug,
  subcategorySlug,
  images = [],
  compatibility = [],
  featured = false,
}) {
  await execute(
    `INSERT INTO products (slug, name, reference, description, category_slug, subcategory_slug, images, compatibility, featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      slug,
      name,
      reference,
      description,
      categorySlug,
      subcategorySlug,
      JSON.stringify(images),
      JSON.stringify(compatibility),
      featured ? 1 : 0,
    ]
  )
  return await getProduct(slug)
}

export async function updateProduct(slug, fields) {
  const rows = await query('SELECT * FROM products WHERE slug = ? LIMIT 1', [slug])
  const current = rows[0]
  if (!current) return null

  const images =
    fields.images !== undefined ? JSON.stringify(fields.images) : current.images
  const compatibility =
    fields.compatibility !== undefined
      ? JSON.stringify(fields.compatibility)
      : current.compatibility

  await execute(
    `UPDATE products
     SET name = ?, reference = ?, description = ?, category_slug = ?, subcategory_slug = ?, images = ?, compatibility = ?, featured = ?
     WHERE slug = ?`,
    [
      fields.name ?? current.name,
      fields.reference ?? current.reference,
      fields.description ?? current.description,
      fields.categorySlug ?? current.category_slug,
      fields.subcategorySlug ?? current.subcategory_slug,
      images,
      compatibility,
      fields.featured !== undefined ? (fields.featured ? 1 : 0) : current.featured,
      slug,
    ]
  )
  return await getProduct(slug)
}

export async function deleteProduct(slug) {
  const result = await execute('DELETE FROM products WHERE slug = ?', [slug])
  return result.affectedRows > 0
}

export function slugify(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
