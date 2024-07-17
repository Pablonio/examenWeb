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

  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};