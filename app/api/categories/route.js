import { ensureDb } from '@/lib/ensure-db.js'
import {
  withApiHandler,
  parseJsonBody,
  jsonResponse,
  jsonError,
  noContent,
} from '@/lib/api.js'
import {
  getCategories,
  categoryExists,
  insertCategory,
  slugify,
} from '@/lib/db.js'

export async function GET() {
  return withApiHandler(async () => {
    await ensureDb()
    return jsonResponse(await getCategories())
  })
}

export async function POST(request) {
  return withApiHandler(async () => {
    await ensureDb()
    const body = await parseJsonBody(request)
    const name = (body?.name ?? '').trim()
    if (!name) return jsonError('Le nom est requis.', 400)

    const slug = slugify(body?.slug || name)
    if (!slug) return jsonError('Slug invalide.', 400)
    if (await categoryExists(slug)) {
      return jsonError('Cette catégorie existe déjà.', 409)
    }

    const category = await insertCategory({
      slug,
      name,
      description: (body?.description ?? '').trim(),
      image: (body?.image ?? '').trim(),
      iconPng: `/categories/icons/${slug}.png`,
    })
    return jsonResponse(category, 201)
  })
}
