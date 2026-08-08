import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt ,{ JwtPayload } from "jsonwebtoken";
 
const AUTH_ROUTES =   ["/login", "/register"];
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


  return NextResponse.next();
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}