import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Define public paths that authenticated users should not access (e.g. login/register)
  const isPublicAuthPath = pathname === '/login' || pathname === '/register'
  
  // Define protected paths that require authentication
  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')

  // If trying to access a protected path without a token, redirect to login
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If trying to access login/register with a valid token, redirect to dashboard
  if (isPublicAuthPath && token) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

// Config to specify which paths the middleware should run on
export const config = {
  matcher: ['/login', '/register', '/dashboard/:path*', '/admin/:path*'],
}
