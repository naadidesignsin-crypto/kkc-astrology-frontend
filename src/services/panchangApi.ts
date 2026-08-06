import type { DailyPanchangResponse } from "../types/panchang";

const API_BASE_URL =
  import.meta.env.VITE_KKC_BACKEND_URL || "http://localhost:8080";

async function request<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, { signal });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getDailyPanchang(
  date: string,
  place: string,
  signal?: AbortSignal
): Promise<DailyPanchangResponse> {
  const params = new URLSearchParams({
    date,
    place,
  });

  return request<DailyPanchangResponse>(
    `/api/panchang/daily?${params.toString()}`,
    signal
  );
}
