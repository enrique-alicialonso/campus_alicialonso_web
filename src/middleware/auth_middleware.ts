import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase/config/firebase-admin";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  // Skip auth check for public routes
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Verify session
    const decodedClaims = await adminAuth.verifySessionCookie(session, true);
    const isInDomain = decodedClaims.email?.endsWith("@alicialonso.org");

    if (!isInDomain) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid session
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
