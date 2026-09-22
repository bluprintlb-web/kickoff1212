// UNUSED — product.imageUploadSignature now signs Firebase Storage uploads
// instead (src/lib/firebase/admin.ts). Cloudinary sign-up geo-blocked this
// account's location (2026-09-22); left in place rather than deleted in
// case that ever changes.
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const CLOUDINARY_PRODUCT_FOLDER = "kick-off/products";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export { cloudinary };
