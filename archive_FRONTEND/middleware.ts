import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

 
  const isPublicAuthPath = pathname === '/login' || pathname === '/register'
  
  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')

  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (isPublicAuthPath && token) {
    const userCookie = request.cookies.get('user')?.value
    let target = '/dashboard'
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie)
        if (user.role === 'admin') target = '/admin'
      } catch {}
    }
    const url = new URL(target, request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register', '/dashboard/:path*', '/admin/:path*'],
}
