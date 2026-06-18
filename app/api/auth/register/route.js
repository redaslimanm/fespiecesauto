import { ensureDb } from '@/lib/ensure-db.js'
import { EMAIL_REGEX, withApiHandler, parseJsonBody, jsonResponse, jsonError } from '@/lib/api.js'
import { getUserByEmail, createUser } from '@/lib/db.js'

export async function POST(request) {
  return withApiHandler(async () => {
    await ensureDb()
    const body = await parseJsonBody(request)
    const name = (body?.name ?? '').trim()
    const email = (body?.email ?? '').trim().toLowerCase()
    const password = body?.password ?? ''

    if (!name) return jsonError('Le nom est requis.', 400)
    if (!EMAIL_REGEX.test(email)) return jsonError('Email invalide.', 400)
    if (String(password).length < 6) {
      return jsonError('Le mot de passe doit contenir au moins 6 caractères.', 400)
    }
    if (await getUserByEmail(email)) {
      return jsonError('Un compte avec cet email existe déjà.', 409)
    }

    const user = await createUser({ name, email, password })
    return jsonResponse({ user }, 201)
  })
}
