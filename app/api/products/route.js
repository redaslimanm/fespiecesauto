import { ensureDb } from '@/lib/ensure-db.js'
import { withApiHandler, parseJsonBody, jsonResponse, jsonError } from '@/lib/api.js'
import {
  getProducts,
  categoryExists,
  subcategoryExists,
  productExists,
  insertProduct,
  slugify,
} from '@/lib/db.js'

export async function GET() {
  return withApiHandler(async () => {
    await ensureDb()
    return jsonResponse(await getProducts())
  })
}

export async function POST(request) {
  return withApiHandler(async () => {
    await ensureDb()
    const body = await parseJsonBody(request)
    const name = (body?.name ?? '').trim()
    if (!name) return jsonError('Le nom est requis.', 400)

    const categorySlug = (body?.categorySlug ?? '').trim()
    const subcategorySlug = (body?.subcategorySlug ?? '').trim()
    if (!categorySlug || !(await categoryExists(categorySlug))) {
      return jsonError('Catégorie invalide.', 400)
    }
    if (!subcategorySlug || !(await subcategoryExists(categorySlug, subcategorySlug))) {
      return jsonError('Sous-catégorie invalide.', 400)
    }

    const slug = slugify(body?.slug || name)
    if (!slug) return jsonError('Slug invalide.', 400)
    if (await productExists(slug)) {
      return jsonError('Ce produit existe déjà.', 409)
    }

    const images = Array.isArray(body?.images)
      ? body.images.filter((url) => typeof url === 'string' && url.trim())
      : body?.image?.trim()
        ? [body.image.trim()]
        : []

    const product = await insertProduct({
      slug,
      name,
      reference: (body?.reference ?? '').trim(),
      description: (body?.description ?? '').trim(),
      categorySlug,
      subcategorySlug,
      images,
      compatibility: Array.isArray(body?.compatibility) ? body.compatibility : [],
      featured: Boolean(body?.featured),
    })
    return jsonResponse(product, 201)
  })
}
