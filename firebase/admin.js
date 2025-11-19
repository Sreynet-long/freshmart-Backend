// backend/firebase/admin.js
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const bucket = admin.storage().bucket();

/**
 * Upload Buffer to Firebase Storage and return public URL
 * @param {Buffer} fileBuffer
 * @param {String} fileName
 * @param {String} mimetype
 * @returns {String} publicUrl
 */
export async function uploadImageToFirebase(fileBuffer, fileName, mimetype) {
  const destination = `products/${Date.now()}_${fileName}`;
  const file = bucket.file(destination);

  await file.save(fileBuffer, { contentType: mimetype });

  // Make public (optional). If you don't want public files, remove this and use signed URLs.
  await file.makePublic();

  // Public URL
  return `https://storage.googleapis.com/${bucket.name}/${file.name}`;
}

/**
 * Delete a file in Firebase Storage by its full path (e.g. products/123_name.jpg)
 */
export async function deleteImageFromFirebase(filePath) {
  if (!filePath) return;
  const file = bucket.file(filePath);
  try {
    await file.delete();
  } catch (err) {
    // ignore if not found
    console.warn("Failed to delete file:", err.message || err);
  }
}
