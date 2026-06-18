import { existsSync, mkdirSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import {
  initDatabase,
  getCategories,
  getCategory,
  categoryExists,
  insertCategory,
  updateCategory,
  deleteCategory,
  subcategoryExists,
  insertSubcategory,
  updateSubcategory,
  deleteSubcategory,
  slugify,
  getUserByEmail,
  createUser,
  verifyCredentials,
  getProducts,
  getProduct,
  productExists,
  insertProduct,
  updateProduct,
  deleteProduct,
} from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = join(__dirname, 'uploads')
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true })
}

const app = express()
const PORT = process.env.PORT || 4000
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(UPLOADS_DIR))

function asyncRoute(handler) {
  return (req, res) => {
    handler(req, res).catch((err) => {
      console.error(err)
      if (!res.headersSent) {
        res.status(500).json({ error: 'Erreur serveur.' })
      }
    })
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase() || '.png'
    const base = slugify(file.originalname.replace(ext, '')) || 'image'
    cb(null, `${base}-${Date.now()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) return cb(null, true)
    cb(new Error("Format d'image non supporté."))
  },
})

app.post('/api/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu.' })
    const url = `/uploads/${req.file.filename}`
    res.status(201).json({ url })
  })
})

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.post(
  '/api/auth/register',
  asyncRoute(async (req, res) => {
    const name = (req.body?.name ?? '').trim()
    const email = (req.body?.email ?? '').trim().toLowerCase()
    const password = req.body?.password ?? ''

    if (!name) return res.status(400).json({ error: 'Le nom est requis.' })
    if (!EMAIL_REGEX.test(email)) return res.status(400).json({ error: 'Email invalide.' })
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' })
    }
    if (await getUserByEmail(email)) {
      return res.status(409).json({ error: 'Un compte avec cet email existe déjà.' })
    }

    const user = await createUser({ name, email, password })
    res.status(201).json({ user })
  })
)

app.post(
  '/api/auth/login',
  asyncRoute(async (req, res) => {
    const email = (req.body?.email ?? '').trim().toLowerCase()
    const password = req.body?.password ?? ''

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' })
    }

    const user = await verifyCredentials(email, password)
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' })

    res.json({ user })
  })
)

app.get(
  '/api/categories',
  asyncRoute(async (req, res) => {
    res.json(await getCategories())
  })
)

app.get(
  '/api/categories/:slug',
  asyncRoute(async (req, res) => {
    const category = await getCategory(req.params.slug)
    if (!category) return res.status(404).json({ error: 'Catégorie introuvable.' })
    res.json(category)
  })
)

app.post(
  '/api/categories',
  asyncRoute(async (req, res) => {
    const name = (req.body?.name ?? '').trim()
    if (!name) return res.status(400).json({ error: 'Le nom est requis.' })

    const slug = slugify(req.body?.slug || name)
    if (!slug) return res.status(400).json({ error: 'Slug invalide.' })
    if (await categoryExists(slug)) {
      return res.status(409).json({ error: 'Cette catégorie existe déjà.' })
    }

    const category = await insertCategory({
      slug,
      name,
      description: (req.body?.description ?? '').trim(),
      image: (req.body?.image ?? '').trim(),
      iconPng: `/categories/icons/${slug}.png`,
    })
    res.status(201).json(category)
  })
)

app.put(
  '/api/categories/:slug',
  asyncRoute(async (req, res) => {
    const updated = await updateCategory(req.params.slug, {
      name:
        typeof req.body?.name === 'string' && req.body.name.trim() ? req.body.name.trim() : undefined,
      description:
        typeof req.body?.description === 'string' ? req.body.description.trim() : undefined,
      image: typeof req.body?.image === 'string' ? req.body.image.trim() : undefined,
    })
    if (!updated) return res.status(404).json({ error: 'Catégorie introuvable.' })
    res.json(updated)
  })
)

app.delete(
  '/api/categories/:slug',
  asyncRoute(async (req, res) => {
    if (!(await deleteCategory(req.params.slug))) {
      return res.status(404).json({ error: 'Catégorie introuvable.' })
    }
    res.status(204).end()
  })
)

app.post(
  '/api/categories/:slug/subcategories',
  asyncRoute(async (req, res) => {
    const name = (req.body?.name ?? '').trim()
    if (!name) return res.status(400).json({ error: 'Le nom est requis.' })
    if (!(await categoryExists(req.params.slug))) {
      return res.status(404).json({ error: 'Catégorie introuvable.' })
    }

    const subSlug = slugify(req.body?.slug || name)
    if (!subSlug) return res.status(400).json({ error: 'Slug invalide.' })
    if (await subcategoryExists(req.params.slug, subSlug)) {
      return res.status(409).json({ error: 'Cette sous-catégorie existe déjà.' })
    }

    const subcategory = await insertSubcategory(req.params.slug, {
      slug: subSlug,
      name,
      description: (req.body?.description ?? '').trim(),
      image: (req.body?.image ?? '').trim(),
    })
    res.status(201).json(subcategory)
  })
)

app.put(
  '/api/categories/:slug/subcategories/:subSlug',
  asyncRoute(async (req, res) => {
    if (!(await subcategoryExists(req.params.slug, req.params.subSlug))) {
      return res.status(404).json({ error: 'Sous-catégorie introuvable.' })
    }

    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : undefined
    if (name === '') return res.status(400).json({ error: 'Le nom est requis.' })

    const updated = await updateSubcategory(req.params.slug, req.params.subSlug, {
      name,
      description: typeof req.body?.description === 'string' ? req.body.description.trim() : undefined,
      image: typeof req.body?.image === 'string' ? req.body.image.trim() : undefined,
    })
    res.json(updated)
  })
)

app.delete(
  '/api/categories/:slug/subcategories/:subSlug',
  asyncRoute(async (req, res) => {
    if (!(await deleteSubcategory(req.params.slug, req.params.subSlug))) {
      return res.status(404).json({ error: 'Sous-catégorie introuvable.' })
    }
    res.status(204).end()
  })
)

app.get(
  '/api/products',
  asyncRoute(async (req, res) => {
    res.json(await getProducts())
  })
)

app.get(
  '/api/products/:slug',
  asyncRoute(async (req, res) => {
    const product = await getProduct(req.params.slug)
    if (!product) return res.status(404).json({ error: 'Produit introuvable.' })
    res.json(product)
  })
)

app.post(
  '/api/products',
  asyncRoute(async (req, res) => {
    const name = (req.body?.name ?? '').trim()
    if (!name) return res.status(400).json({ error: 'Le nom est requis.' })

    const categorySlug = (req.body?.categorySlug ?? '').trim()
    const subcategorySlug = (req.body?.subcategorySlug ?? '').trim()
    if (!categorySlug || !(await categoryExists(categorySlug))) {
      return res.status(400).json({ error: 'Catégorie invalide.' })
    }
    if (!subcategorySlug || !(await subcategoryExists(categorySlug, subcategorySlug))) {
      return res.status(400).json({ error: 'Sous-catégorie invalide.' })
    }

    const slug = slugify(req.body?.slug || name)
    if (!slug) return res.status(400).json({ error: 'Slug invalide.' })
    if (await productExists(slug)) {
      return res.status(409).json({ error: 'Ce produit existe déjà.' })
    }

    const images = Array.isArray(req.body?.images)
      ? req.body.images.filter((url) => typeof url === 'string' && url.trim())
      : req.body?.image?.trim()
        ? [req.body.image.trim()]
        : []

    const product = await insertProduct({
      slug,
      name,
      reference: (req.body?.reference ?? '').trim(),
      description: (req.body?.description ?? '').trim(),
      categorySlug,
      subcategorySlug,
      images,
      compatibility: Array.isArray(req.body?.compatibility) ? req.body.compatibility : [],
      featured: Boolean(req.body?.featured),
    })
    res.status(201).json(product)
  })
)

app.put(
  '/api/products/:slug',
  asyncRoute(async (req, res) => {
    const current = await getProduct(req.params.slug)
    if (!current) return res.status(404).json({ error: 'Produit introuvable.' })

    const categorySlug =
      typeof req.body?.categorySlug === 'string' && req.body.categorySlug.trim()
        ? req.body.categorySlug.trim()
        : current.categorySlug
    const subcategorySlug =
      typeof req.body?.subcategorySlug === 'string' && req.body.subcategorySlug.trim()
        ? req.body.subcategorySlug.trim()
        : current.subcategorySlug

    if (!(await categoryExists(categorySlug))) {
      return res.status(400).json({ error: 'Catégorie invalide.' })
    }
    if (!(await subcategoryExists(categorySlug, subcategorySlug))) {
      return res.status(400).json({ error: 'Sous-catégorie invalide.' })
    }

    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : undefined
    if (name === '') return res.status(400).json({ error: 'Le nom est requis.' })

    let images = undefined
    if (Array.isArray(req.body?.images)) {
      images = req.body.images.filter((url) => typeof url === 'string' && url.trim())
    } else if (typeof req.body?.image === 'string') {
      images = req.body.image.trim() ? [req.body.image.trim()] : []
    }

    const updated = await updateProduct(req.params.slug, {
      name,
      reference: typeof req.body?.reference === 'string' ? req.body.reference.trim() : undefined,
      description:
        typeof req.body?.description === 'string' ? req.body.description.trim() : undefined,
      categorySlug,
      subcategorySlug,
      images,
      featured: typeof req.body?.featured === 'boolean' ? req.body.featured : undefined,
    })
    res.json(updated)
  })
)

app.delete(
  '/api/products/:slug',
  asyncRoute(async (req, res) => {
    if (!(await deleteProduct(req.params.slug))) {
      return res.status(404).json({ error: 'Produit introuvable.' })
    }
    res.status(204).end()
  })
)

try {
  await initDatabase()
  app.listen(PORT, () => {
    console.log(`API AutoPièces Fès en écoute sur http://localhost:${PORT}`)
    console.log(`MySQL: ${process.env.DB_NAME || 'autopiecesfes'} @ ${process.env.DB_HOST || 'localhost'}`)
  })
} catch (err) {
  console.error('Impossible de démarrer le serveur:', err.message)
  process.exit(1)
}
