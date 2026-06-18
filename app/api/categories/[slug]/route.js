import { ensureDb } from '@/lib/ensure-db.js'
import {
  withApiHandler,
  parseJsonBody,
  jsonResponse,
  jsonError,
  noContent,
} from '@/lib/api.js'
import {
  getCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/db.js'

export async function GET(_request, { params }) {
  return withApiHandler(async () => {
    await ensureDb()
    const { slug } = await params
    const category = await getCategory(slug)
    if (!category) return jsonError('Catégorie introuvable.', 404)
    return jsonResponse(category)
  })
}

export async function PUT(request, { params }) {
  return withApiHandler(async () => {
    await ensureDb()
    const { slug } = await params
    const body = await parseJsonBody(request)
    const updated = await updateCategory(slug, {
      name:
        typeof body?.name === 'string' && body.name.trim() ? body.name.trim() : undefined,
      description:
        typeof body?.description === 'string' ? body.description.trim() : undefined,
      image: typeof body?.image === 'string' ? body.image.trim() : undefined,
    })
    if (!updated) return jsonError('Catégorie introuvable.', 404)
    return jsonResponse(updated)
  })
}

export async function DELETE(_request, { params }) {
  return withApiHandler(async () => {
    await ensureDb()
    const { slug } = await params
    if (!(await deleteCategory(slug))) {
      return jsonError('Catégorie introuvable.', 404)
    }
    return noContent()
  })
}
