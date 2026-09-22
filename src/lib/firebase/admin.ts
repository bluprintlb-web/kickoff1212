import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

// UNUSED — product photo uploads now go through Vercel Blob instead (see
// src/app/api/upload/route.ts). This was meant to mint signed direct-upload
// URLs for product photos via the Firebase Admin SDK, same idea as
// Cloudinary before it (src/lib/cloudinary.ts, also left in place unused —
// Cloudinary's signup geo-blocked this account's location). Firebase
// Storage itself turned out to need a Google Cloud Blaze billing account to
// even provision a bucket, and that billing setup failed with an
// unresolved Google-side account error (2026-09-22) — left in place rather
// than deleted in case that's ever worth revisiting. Needs a real service
// account (Firebase Console → Project Settings → Service Accounts →
// Generate new private key), base64-encoded into one env var so it survives
// a plain .env line without newline-escaping headaches.
function loadServiceAccount() {
  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
  if (!encoded) return null;
  try {
    const json = JSON.parse(Buffer.from(encoded, "base64").toString("utf8")) as {
      project_id: string;
      client_email: string;
      private_key: string;
    };
    return {
      projectId: json.project_id,
      clientEmail: json.client_email,
      privateKey: json.private_key,
    };
  } catch {
    return null;
  }
}

const serviceAccount = loadServiceAccount();
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

export function isFirebaseAdminConfigured() {
  return serviceAccount !== null && Boolean(storageBucket);
}

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  if (!serviceAccount || !storageBucket) return null;
  return initializeApp({
    credential: cert(serviceAccount),
    storageBucket,
  });
}

export function getAdminBucket() {
  const app = getAdminApp();
  if (!app) throw new Error("Firebase Admin isn't configured.");
  return getStorage(app).bucket();
}
