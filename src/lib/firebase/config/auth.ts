import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";
import { DecodedIdToken } from "firebase-admin/auth";
import { USER_SCOPES } from "@/lib/constants/google_scopes";
import { GoogleAuthProvider } from "firebase/auth";

/**
 * Get the session from the cookies
 * @returns The session or null if there is no session
 */
export async function getSession(): Promise<DecodedIdToken | null> {
  try {
    const session = cookies().get("session")?.value;
    if (!session) return null;

    const decodedClaims = await adminAuth.verifySessionCookie(session);
    return decodedClaims;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function getUserEmail(): Promise<string | null> {
  try {
    const session = await getSession();
    if (!session) return null;

    const user = await adminAuth.getUser(session.uid);
    return user.email || null;
  } catch (error) {
    console.error("Error getting user email:", error);
    return null;
  }
}

export async function getUserUID(): Promise<string | null> {
  const session = await getSession();
  if (!session) return null;
  return session.uid;
}
