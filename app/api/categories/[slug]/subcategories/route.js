import { ensureDb } from '@/lib/ensure-db.js'
import { withApiHandler, parseJsonBody, jsonResponse, jsonError } from '@/lib/api.js'
import {
  categoryExists,
  subcategoryExists,
  insertSubcategory,
  slugify,
} from '@/lib/db.js'

export async function POST(request, { params }) {
  return withApiHandler(async () => {
    await ensureDb()
    const { slug } = await params
    const body = await parseJsonBody(request)
    const name = (body?.name ?? '').trim()
    if (!name) return jsonError('Le nom est requis.', 400)
    if (!(await categoryExists(slug))) {
      return jsonError('Catégorie introuvable.', 404)
    }

    const subSlug = slugify(body?.slug || name)
    if (!subSlug) return jsonError('Slug invalide.', 400)
    if (await subcategoryExists(slug, subSlug)) {
      return jsonError('Cette sous-catégorie existe déjà.', 409)
    }

    const subcategory = await insertSubcategory(slug, {
      slug: subSlug,
      name,
      description: (body?.description ?? '').trim(),
      image: (body?.image ?? '').trim(),
    })
    return jsonResponse(subcategory, 201)
  })
}
