import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const credentials = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_CREDENTIALS || ""
  );
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });
}

export const adminAuth = admin.auth();
