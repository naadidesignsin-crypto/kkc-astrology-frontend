import type { LocationSearchResponse } from "../types/location";

const API_BASE_URL =
  import.meta.env.VITE_KKC_BACKEND_URL || "http://localhost:8081";

export async function searchLocations(
  query: string,
  limit = 8,
  signal?: AbortSignal
): Promise<LocationSearchResponse[]> {
  const params = new URLSearchParams({
    query,
    limit: String(limit),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/locations/search?${params.toString()}`,
    { signal }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Unable to search locations");
  }

  return response.json();
}