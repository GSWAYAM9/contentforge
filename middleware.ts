import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'development-secret-key'
)

const protectedRoutes = ['/dashboard', '/projects', '/project', '/settings']

async function getAuthToken(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value
  if (!token) return null

  try {
    const verified = await jwtVerify(token, secret)
    return (verified.payload as any).user || null
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const user = await getAuthToken(req)

  // Check if route is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Redirect to login if accessing protected route without session
  if (isProtected && !user) {
    const url = new URL('/auth/login', req.nextUrl.origin)
    url.searchParams.set('callbackUrl', encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if accessing auth pages while authenticated
  if (pathname.startsWith('/auth/') && user) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon|apple-icon).*)'],
}
