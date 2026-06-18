import { ensureDb } from '@/lib/ensure-db.js'
import { withApiHandler } from '@/lib/api.js'
import { getSubcategoryImage } from '@/lib/db.js'

export async function GET(_request, { params }) {
  return withApiHandler(async () => {
    await ensureDb()
    const { categorySlug, subSlug } = await params
    const image = await getSubcategoryImage(categorySlug, subSlug)
    if (!image) return new Response(null, { status: 404 })

    return new Response(image.data, {
      status: 200,
      headers: {
        'Content-Type': image.mime,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  })
}
