import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/config/firebase-admin";

export async function POST(request: Request) {
  const { token } = await request.json();

  try {
    //= Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const isInDomain = decodedToken.email?.endsWith("@alicialonso.org");
    if (!isInDomain) {
      return NextResponse.json({ success: false }, { status: 401 });
    }
    //= Create a session cookie
    const expiresIn = 60 * 60 * 24 * 7 * 1000; // 1 week
    const sessionCookie = await adminAuth.createSessionCookie(token, {
      expiresIn,
    });

    //= Set the session cookie
    cookies().set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expiresIn,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
