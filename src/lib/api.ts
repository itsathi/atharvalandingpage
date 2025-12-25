// src/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ""; // "" for relative

// Helper for fetch with cache and revalidate
export async function fetchWithCache<T>(
  path: string,
  options?: { revalidate?: number; cache?: RequestCache }
): Promise<T> {
  const { revalidate, cache } = options || {};
  return fetch(`${BASE_URL}${path}`, {
    next: revalidate ? { revalidate } : undefined,
    cache: cache || (revalidate ? "force-cache" : "default"),
  }).then((res) => {
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    return res.json();
  });
}

// Specific API helpers
export async function getSlots() {
  // Revalidate every 5 minutes (300s)
  return fetchWithCache("/api/slots", { revalidate: 300 });
}

export async function getContent() {
  // Revalidate every 2 minutes (120s)
  return fetchWithCache("/api/content", { revalidate: 120 });
}

export async function getLinks() {
  // Revalidate every 5 minutes (300s)
  return fetchWithCache("/api/links", { revalidate: 300 });
}

export async function getSpotify() {
  // Revalidate every 45 seconds
  return fetchWithCache("/api/spotify", { revalidate: 45 });
}