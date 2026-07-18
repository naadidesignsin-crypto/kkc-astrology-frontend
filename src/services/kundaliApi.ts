import type {
  KundaliDashaResponse,
  KundaliDoshaResponse,
  KundaliGenerateRequest,
  KundaliGenerateResponse,
  KundaliPlanetsResponse,
  KundaliSummaryResponse,
} from "../types/kundali";

const API_BASE_URL =
  import.meta.env.VITE_KKC_BACKEND_URL || "http://localhost:8081";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function generateKundali(
  payload: KundaliGenerateRequest
): Promise<KundaliGenerateResponse> {
  return request<KundaliGenerateResponse>("/api/kundali/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function generateSection(
  reportId: number,
  sectionType: "PLANETARY_POSITIONS" | "DASHA" | "DOSHA"
) {
  return request(`/api/kundali/reports/${reportId}/sections/${sectionType}/generate`, {
    method: "POST",
  });
}

export function getSummary(reportId: number): Promise<KundaliSummaryResponse> {
  return request<KundaliSummaryResponse>(
    `/api/kundali/reports/${reportId}/summary`
  );
}

export function getPlanets(reportId: number): Promise<KundaliPlanetsResponse> {
  return request<KundaliPlanetsResponse>(
    `/api/kundali/reports/${reportId}/planets`
  );
}

export function getDasha(reportId: number): Promise<KundaliDashaResponse> {
  return request<KundaliDashaResponse>(
    `/api/kundali/reports/${reportId}/dasha`
  );
}

export function getDosha(reportId: number): Promise<KundaliDoshaResponse> {
  return request<KundaliDoshaResponse>(
    `/api/kundali/reports/${reportId}/dosha`
  );
}