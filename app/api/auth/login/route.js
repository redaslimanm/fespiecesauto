import { ensureDb } from '@/lib/ensure-db.js'
import { withApiHandler, parseJsonBody, jsonResponse, jsonError } from '@/lib/api.js'
import { verifyCredentials } from '@/lib/db.js'

export async function POST(request) {
  return withApiHandler(async () => {
    await ensureDb()
    const body = await parseJsonBody(request)
    const email = (body?.email ?? '').trim().toLowerCase()
    const password = body?.password ?? ''

    if (!email || !password) {
      return jsonError('Email et mot de passe requis.', 400)
    }

    const user = await verifyCredentials(email, password)
    if (!user) return jsonError('Email ou mot de passe incorrect.', 401)

    return jsonResponse({ user })
  })
}
