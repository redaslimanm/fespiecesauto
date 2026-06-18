const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export { EMAIL_REGEX }

export function jsonResponse(data, status = 200) {
  return Response.json(data, { status })
}

export function jsonError(message, status = 500) {
  return Response.json({ error: message }, { status })
}

export function noContent() {
  return new Response(null, { status: 204 })
}

export async function parseJsonBody(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

export async function withApiHandler(handler) {
  try {
    return await handler()
  } catch (err) {
    console.error(err)
    const message = err instanceof Error ? err.message : 'Erreur serveur.'
    if (message.includes('Format d') || message.includes('fichier')) {
      return jsonError(message, 400)
    }
    return jsonError('Erreur serveur.', 500)
  }
}
