// Local-only prototype persistence. Media stays in this browser, never uploaded.
const DATABASE = 'vehiclespot-prototype';
const MEDIA_PREFIX = 'prototype-media:';
const objectUrls = new Map<string, string>();

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('assets');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Close other prototype tabs and retry browser storage.'));
  });
}

export async function writePrototypeValue(key: string, value: unknown): Promise<void> {
  // Keep wizard fields in localStorage; large photo/video payloads stay in IndexedDB.
  if (key.startsWith('listing-draft:')) {
    const galleryKey = `draft-gallery:${key}`;
    if (value && typeof value === 'object') {
      const fields = value as Record<string, unknown>;
      await writePrototypeValue(galleryKey, fields.photos || []);
      localStorage.setItem(key, JSON.stringify({ ...fields, photos: undefined, _galleryKey: galleryKey }));
    } else {
      localStorage.removeItem(key);
      await writePrototypeValue(galleryKey, undefined);
    }
    // Clear the previous all-IndexedDB draft format after migration.
    value = undefined;
  }
  const db = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('assets', 'readwrite');
      transaction.objectStore('assets').put(value, key);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally { db.close(); }
}

export async function readPrototypeValue<T>(key: string): Promise<T | undefined> {
  if (key.startsWith('listing-draft:')) {
    const raw = localStorage.getItem(key);
    if (raw) {
      const fields = JSON.parse(raw) as Record<string, unknown>;
      const photos = await readPrototypeValue<string[]>(String(fields._galleryKey));
      return { ...fields, photos: photos || [] } as T;
    }
  }
  const db = await openDatabase();
  try {
    return await new Promise<T | undefined>((resolve, reject) => {
      const request = db.transaction('assets').objectStore('assets').get(key);
      request.onsuccess = () => resolve(request.result as T | undefined);
      request.onerror = () => reject(request.error);
    });
  } finally { db.close(); }
}

export async function storePrototypeVideo(file: File): Promise<{ source: string; url: string }> {
  const source = `${MEDIA_PREFIX}${crypto.randomUUID()}`;
  await writePrototypeValue(source, file);
  const url = URL.createObjectURL(file);
  objectUrls.set(source, url);
  return { source, url };
}

export async function resolvePrototypeVideo(source?: string): Promise<string | undefined> {
  if (source?.startsWith('https://assets.mixkit.co/')) return '/demo/videos/driving-sample.mp4';
  if (!source?.startsWith(MEDIA_PREFIX)) return source;
  const cached = objectUrls.get(source);
  if (cached) return cached;
  const blob = await readPrototypeValue<Blob>(source);
  if (!blob) return undefined;
  const url = URL.createObjectURL(blob);
  objectUrls.set(source, url);
  return url;
}

export async function preparePrototypePhoto(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose JPG, PNG or WebP photos.');
  if (file.size > 20 * 1024 * 1024) throw new Error('Each photo must be under 20 MB.');
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width < 800 || bitmap.height < 600) throw new Error('Photos must be at least 800 × 600 pixels.');
    const scale = Math.min(1, 960 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Photo preview is unavailable in this browser.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.7);
  } finally { bitmap.close(); }
}
