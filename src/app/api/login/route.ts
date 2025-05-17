import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/config/firebase-admin";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Safely parse the request body
    let token: string;
    try {
      const body = await request.json();
      if (!body || typeof body.token !== "string") {
        return NextResponse.json(
          { success: false, error: "Invalid request body" },
          { status: 400 }
        );
      }
      token = body.token;
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const isInDomain = decodedToken.email?.endsWith("@alicialonso.org");
    if (!isInDomain) {
      return NextResponse.json(
        { success: false, error: "User not in domain" },
        { status: 401 }
      );
    }

    // Create a session cookie
    const expiresIn = 60 * 60 * 24 * 7 * 1000; // 1 week
    const sessionCookie = await adminAuth.createSessionCookie(token, {
      expiresIn,
    });

    // Set the session cookie
    cookies().set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expiresIn,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in login route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
