import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';
if (JWT_SECRET === 'secret-key' && process.env.NODE_ENV === 'production') {
  //console.warn('⚠️  Using default JWT secret in production!');
}

async function verifyJWT(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  const isPublicPath =
    pathname === '/' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.gif');

  // Admin routes that require admin role
  const isAdminPath = pathname.startsWith('/admin');

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const payload = await verifyJWT(token);

  if (!payload) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Check if user is trying to access admin routes
  if (isAdminPath) {
    const userRole = payload.role as string;
    if (userRole !== 'admin') {
      // Redirect non-admin users to dashboard or home
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Add user info to request headers for API routes
  const response = NextResponse.next();
  response.headers.set('x-user-id', payload.userId as string);
  response.headers.set('x-user-role', payload.role as string);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.png|laptop-product.jpg|coset-product.jpg|confetti.png).*)',
  ],
};
