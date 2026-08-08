import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt ,{ JwtPayload } from "jsonwebtoken";
 
const AUTH_ROUTES =   ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/properties", "/properties/*"];
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  // return NextResponse.redirect(new URL('/home', request.url))
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken")?.value;
  const decodedToken = accessToken ? jwt.decode(accessToken) as JwtPayload : null;

  let userRole = null;

  if(decodedToken){
    userRole = decodedToken.role;
  }


  if(accessToken && AUTH_ROUTES.includes(pathname)){
    if(userRole === "TENANT"){
      return NextResponse.redirect(new URL('/tenant-dashboard', request.url))
    }else if(userRole === "LANDLORD"){
      return NextResponse.redirect(new URL('/landlord-dashboard', request.url))
    }else if(userRole === "ADMIN"){
      return NextResponse.redirect(new URL('/admin-dashboard', request.url))
    }
    
  }

  const isPublic = PUBLIC_ROUTES.some((route) =>pathname == route || pathname.startsWith(route + "/"));
 
  if (!accessToken && !isPublic && !AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if(pathname.startsWith("/tenant-dashboard") && userRole !== "TENANT"){
    return NextResponse.redirect(new URL('/', request.url))
  }else if(pathname.startsWith("/landlord-dashboard") && userRole !== "LANDLORD"){
    return NextResponse.redirect(new URL('/', request.url))
  }else if(pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN"){
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next();
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}