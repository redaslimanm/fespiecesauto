import { ensureDb } from '@/lib/ensure-db.js'
import {
  withApiHandler,
  parseJsonBody,
  jsonResponse,
  jsonError,
  noContent,
} from '@/lib/api.js'
import { subcategoryExists, updateSubcategory, deleteSubcategory } from '@/lib/db.js'

export async function PUT(request, { params }) {
  return withApiHandler(async () => {
    await ensureDb()
    const { slug, subSlug } = await params
    if (!(await subcategoryExists(slug, subSlug))) {
      return jsonError('Sous-catégorie introuvable.', 404)
    }

    const body = await parseJsonBody(request)
    const name = typeof body?.name === 'string' ? body.name.trim() : undefined
    if (name === '') return jsonError('Le nom est requis.', 400)

    const updated = await updateSubcategory(slug, subSlug, {
      name,
      description: typeof body?.description === 'string' ? body.description.trim() : undefined,
      image: typeof body?.image === 'string' ? body.image.trim() : undefined,
    })
    return jsonResponse(updated)
  })
}

export async function DELETE(_request, { params }) {
  return withApiHandler(async () => {
    await ensureDb()
    const { slug, subSlug } = await params
    if (!(await deleteSubcategory(slug, subSlug))) {
      return jsonError('Sous-catégorie introuvable.', 404)
    }
    return noContent()
  })
}
