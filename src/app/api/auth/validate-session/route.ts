import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/config/firebase-admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const sessionCookie = cookies().get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // Verify session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );

    // Check if user's email domain is still valid
    const isInDomain = decodedClaims.email?.endsWith("@alicialonso.org");
    if (!isInDomain) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Error validating session:", error);
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
