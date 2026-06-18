import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { slugify } from './db.js'

export const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]

const MAX_FILE_SIZE = 5 * 1024 * 1024

export function getUploadsDir() {
  return join(process.cwd(), 'public', 'uploads')
}

function validateImageFile(file) {
  if (!file || typeof file === 'string') {
    throw new Error('Aucun fichier reçu.')
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Format d'image non supporté.")
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Fichier trop volumineux (max 5 Mo).')
  }
}

/** Save multipart file to public/uploads (replaces Multer disk storage). */
export async function saveUploadedImage(file) {
  validateImageFile(file)
  const uploadsDir = getUploadsDir()
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true })
  }

  const ext = extname(file.name).toLowerCase() || '.png'
  const base = slugify(file.name.replace(ext, '')) || 'image'
  const filename = `${base}-${Date.now()}${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(join(uploadsDir, filename), buffer)
  return `/uploads/${filename}`
}

/** Read image from FormData for DB storage (replaces Multer memory storage). */
export async function readImageFromFormData(formData, fieldName = 'image') {
  const file = formData.get(fieldName)
  validateImageFile(file)
  const buffer = Buffer.from(await file.arrayBuffer())
  return { buffer, mime: file.type }
}

export async function getImageFromRequest(request) {
  const formData = await request.formData()
  return readImageFromFormData(formData)
}
