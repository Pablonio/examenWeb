// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';

type Roles = 'Vendedor' | 'Usuario';
type ProtectedRoutes = {
  [key in Roles]: string[];
};

const protectedRoutes: ProtectedRoutes = {
    Vendedor: ['/FormularioVendedor'],
    Usuario: ['/FormularioUsuario'],
};

export async function middleware(request: NextRequest) {
  // Set CORS headers
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,DELETE,OPTIONS');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return response;
  }

  const cookieHeader = request.headers.get('cookie');
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const rol = cookies.rol as Roles;

  if (!rol) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const allowedPaths = protectedRoutes[rol];
  if (allowedPaths && !allowedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/FormularioVendedor/:path*', '/FormularioUsuario/:path*'],
};
