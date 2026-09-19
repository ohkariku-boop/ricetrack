/**
 * Meal photos for logged meals only (not food library).
 * - Compress client-side before save
 * - Local accounts: IndexedDB full image + tiny thumb on meal record
 * - Cloud users: Supabase Storage `meal-photos` + photo_url on meals row
 */

const DB_NAME = "ricetrack_meal_photos_v1";
const STORE = "photos";
const MAX_LOCAL_PHOTOS = 40;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Accept data URL or raw base64 + mime → compressed JPEG Blob */
export async function compressImage(
  input: string,
  mimeHint = "image/jpeg",
  maxEdge = 800,
  quality = 0.72
): Promise<Blob> {
  const src = input.startsWith("data:")
    ? input
    : `data:${mimeHint};base64,${input}`;

  const bitmap = await createImageBitmap(await (await fetch(src)).blob());
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
  );
  if (!blob) throw new Error("Compress failed");
  return blob;
}

/** Tiny JPEG data URL for list rows (~80px) */
export async function makeThumbDataUrl(
  input: string,
  mimeHint = "image/jpeg"
): Promise<string> {
  const blob = await compressImage(input, mimeHint, 96, 0.55);
  return blobToDataUrl(blob);
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

export async function storeLocalMealPhoto(
  mealId: string,
  blob: Blob
): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, mealId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  await pruneLocalPhotos(db);
  db.close();
}

async function pruneLocalPhotos(db: IDBDatabase): Promise<void> {
  const keys: IDBValidKey[] = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAllKeys();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
  if (keys.length <= MAX_LOCAL_PHOTOS) return;
  // Keys are insertion order not guaranteed; delete oldest half of excess by string sort on local_ timestamps
  const sorted = [...keys].map(String).sort();
  const toDrop = sorted.slice(0, keys.length - MAX_LOCAL_PHOTOS);
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    toDrop.forEach((k) => store.delete(k));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getLocalMealPhotoBlob(
  mealId: string
): Promise<Blob | null> {
  try {
    const db = await openDb();
    const blob = await new Promise<Blob | null>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(mealId);
      req.onsuccess = () => resolve((req.result as Blob) || null);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return blob;
  } catch {
    return null;
  }
}

export async function getLocalMealPhotoObjectUrl(
  mealId: string
): Promise<string | null> {
  const blob = await getLocalMealPhotoBlob(mealId);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

export async function deleteLocalMealPhoto(mealId: string): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(mealId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    /* ignore */
  }
}

/**
 * Upload to Supabase Storage bucket `meal-photos`.
 * Returns public or signed path URL string, or null if bucket missing.
 */
export async function uploadCloudMealPhoto(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
  mealId: string,
  blob: Blob
): Promise<string | null> {
  const path = `${userId}/${mealId}.jpg`;
  const { error } = await supabase.storage
    .from("meal-photos")
    .upload(path, blob, { contentType: "image/jpeg", upsert: true });
  if (error) {
    console.warn("meal photo upload:", error.message);
    return null;
  }
  const { data } = supabase.storage.from("meal-photos").getPublicUrl(path);
  return data?.publicUrl || path;
}
