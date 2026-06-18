import { ensureDb } from '@/lib/ensure-db.js'
import { withApiHandler, jsonResponse, jsonError, noContent } from '@/lib/api.js'
import {
  subcategoryExists,
  setSubcategoryImage,
  clearSubcategoryImage,
} from '@/lib/db.js'
import { getImageFromRequest } from '@/lib/upload.js'

export async function PUT(request, { params }) {
  return withApiHandler(async () => {
    await ensureDb()
    const { slug, subSlug } = await params
    if (!(await subcategoryExists(slug, subSlug))) {
      return jsonError('Sous-catégorie introuvable.', 404)
    }

    const { buffer, mime } = await getImageFromRequest(request)
    const url = await setSubcategoryImage(slug, subSlug, buffer, mime)
    if (!url) return jsonError('Sous-catégorie introuvable.', 404)
    return jsonResponse({ url })
  })
}

export async function DELETE(_request, { params }) {
  return withApiHandler(async () => {
    await ensureDb()
    const { slug, subSlug } = await params
    if (!(await clearSubcategoryImage(slug, subSlug))) {
      return jsonError('Sous-catégorie introuvable.', 404)
    }
    return noContent()
  })
}
