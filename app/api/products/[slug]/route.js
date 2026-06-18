import { ensureDb } from '@/lib/ensure-db.js'
import {
  withApiHandler,
  parseJsonBody,
  jsonResponse,
  jsonError,
  noContent,
} from '@/lib/api.js'
import {
  getProduct,
  updateProduct,
  deleteProduct,
  categoryExists,
  subcategoryExists,
} from '@/lib/db.js'

export async function GET(_request, { params }) {
  return withApiHandler(async () => {
    await ensureDb()
    const { slug } = await params
    const product = await getProduct(slug)
    if (!product) return jsonError('Produit introuvable.', 404)
    return jsonResponse(product)
  })
}

export async function PUT(request, { params }) {
  return withApiHandler(async () => {
    await ensureDb()
    const { slug } = await params
    const current = await getProduct(slug)
    if (!current) return jsonError('Produit introuvable.', 404)

    const body = await parseJsonBody(request)
    const categorySlug =
      typeof body?.categorySlug === 'string' && body.categorySlug.trim()
        ? body.categorySlug.trim()
        : current.categorySlug
    const subcategorySlug =
      typeof body?.subcategorySlug === 'string' && body.subcategorySlug.trim()
        ? body.subcategorySlug.trim()
        : current.subcategorySlug

    if (!(await categoryExists(categorySlug))) {
      return jsonError('Catégorie invalide.', 400)
    }
    if (!(await subcategoryExists(categorySlug, subcategorySlug))) {
      return jsonError('Sous-catégorie invalide.', 400)
    }

    const name = typeof body?.name === 'string' ? body.name.trim() : undefined
    if (name === '') return jsonError('Le nom est requis.', 400)

    let images = undefined
    if (Array.isArray(body?.images)) {
      images = body.images.filter((url) => typeof url === 'string' && url.trim())
    } else if (typeof body?.image === 'string') {
      images = body.image.trim() ? [body.image.trim()] : []
    }

    const updated = await updateProduct(slug, {
      name,
      reference: typeof body?.reference === 'string' ? body.reference.trim() : undefined,
      description:
        typeof body?.description === 'string' ? body.description.trim() : undefined,
      categorySlug,
      subcategorySlug,
      images,
      featured: typeof body?.featured === 'boolean' ? body.featured : undefined,
    })
    return jsonResponse(updated)
  })
}

export async function DELETE(_request, { params }) {
  return withApiHandler(async () => {
    await ensureDb()
    const { slug } = await params
    if (!(await deleteProduct(slug))) {
      return jsonError('Produit introuvable.', 404)
    }
    return noContent()
  })
}
