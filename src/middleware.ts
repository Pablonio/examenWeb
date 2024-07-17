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
  const cookieHeader = request.headers.get('cookie');
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const rol = cookies.rol as Roles;

  if (!rol ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const allowedPaths = protectedRoutes[rol];
  if (allowedPaths && !allowedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/FormularioVendedor/:path*', '/FormularioUsuario/:path*'],
};