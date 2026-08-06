import type { DailyRasiResponse } from "../types/rasi";

const API_BASE_URL =
  import.meta.env.VITE_KKC_BACKEND_URL || "http://localhost:8080";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    let message = "Unable to load Daily Rasi details.";

    try {
      const errorBody = await response.json();
      message = errorBody.message || errorBody.error || message;
    } catch {
      // Keep fallback message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function getDailyRasi(
  date: string,
  rasi: string,
  place: string
) {
  const params = new URLSearchParams({
    date,
    rasi,
    place,
  });

  return request<DailyRasiResponse>(`/api/rasi/daily?${params.toString()}`);
}
