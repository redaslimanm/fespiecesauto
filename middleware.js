import { NextResponse } from 'next/server'

function corsHeaders(origin) {
  const allowed = process.env.CORS_ORIGIN || origin || '*'
  return {
    'Access-Control-Allow-Origin': allowed === '*' ? origin || '*' : allowed,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}

export function middleware(request) {
  const origin = request.headers.get('origin') || '*'

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
  }

  const response = NextResponse.next()
  Object.entries(corsHeaders(origin)).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

export const config = {
  matcher: '/api/:path*',
}
