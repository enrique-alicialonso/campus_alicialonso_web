import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { adminAuth } from "@/lib/firebase/config/firebase-admin";
import { guserauth } from "@/lib/google/google_auth";

export async function POST(req: NextRequest) {
  const authorization = req.headers.get("authorization");

  if (!authorization) {
    return NextResponse.json(
      { error: "No authorization email provided" },
      { status: 401 }
    );
  }
  if (!authorization.endsWith("@alicialonso.org")) {
    return NextResponse.json({ error: "User not in domain" }, { status: 401 });
  }

  try {
    const userKey = authorization;
    const client = guserauth(userKey);
    const userInfo = await google
      .admin({ version: "directory_v1", auth: client })
      .users.get({
        userKey,
        projection: "full",
      });
    console.log(userInfo.data);
    return NextResponse.json(userInfo.data);
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
