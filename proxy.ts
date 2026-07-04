import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect all /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = await auth()

    if (!session?.user) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Ensure user has staff role
    if (!['ADMIN', 'STAFF'].includes(session.user.role)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Protect all /api/admin routes
  if (pathname.startsWith('/api/admin')) {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}
