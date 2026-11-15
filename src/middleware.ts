import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "ecosort-fallback-dev-secret-key-32-chars-long";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = "ecosort_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isCitizenRoute = pathname.startsWith("/citizen");
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isCitizenRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/auth/admin/login", req.url));
    }
    return NextResponse.redirect(new URL("/auth/citizen/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;

    if (isAdminRoute && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/admin/login?error=unauthorized", req.url));
    }

    if (isCitizenRoute && role !== "CITIZEN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    const response = NextResponse.redirect(
      new URL(isAdminRoute ? "/auth/admin/login" : "/auth/citizen/login", req.url)
    );
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ["/citizen/:path*", "/admin/:path*"],
};
