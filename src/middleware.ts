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
  // Configuración de CORS
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  // Manejar solicitudes preflight OPTIONS
  if (request.method === 'OPTIONS') {
    return response;
  }

  // Lógica original del middleware
  const cookieHeader = request.headers.get('cookie');
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const rol = cookies.rol as Roles;

  console.log('Current path:', request.nextUrl.pathname);
  console.log('User role:', rol);

  // Si estamos en la página de inicio, no redirijamos
  if (request.nextUrl.pathname === '/') {
    return response;
  }

  if (!rol) {
    console.log('No role found, redirecting to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  const allowedPaths = protectedRoutes[rol];
  if (allowedPaths && !allowedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    console.log('User not allowed on this path, redirecting to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.log('Access granted');
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};