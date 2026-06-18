import { ensureDb } from '@/lib/ensure-db.js'
import { withApiHandler, jsonResponse, jsonError } from '@/lib/api.js'
import { saveUploadedImage } from '@/lib/upload.js'

export async function POST(request) {
  return withApiHandler(async () => {
    await ensureDb()
    const formData = await request.formData()
    const file = formData.get('image')
    const url = await saveUploadedImage(file)
    return jsonResponse({ url }, 201)
  })
}
