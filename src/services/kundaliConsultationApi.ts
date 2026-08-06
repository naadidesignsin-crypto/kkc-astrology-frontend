import type {
  KundaliConsultationCreateRequest,
  KundaliConsultationResponse,
} from "../types/kundaliConsultation";

const API_BASE_URL =
  import.meta.env.VITE_KKC_BACKEND_URL || "http://localhost:8080";

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = "Request failed.";

    try {
      const errorBody = await response.json();
      message =
        errorBody?.message ||
        errorBody?.error ||
        errorBody?.detail ||
        message;
    } catch {
      const text = await response.text().catch(() => "");
      message = text || message;
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function createConsultationRequest(
  orderId: string,
  sectionName: string
): Promise<KundaliConsultationResponse> {
  const payload: KundaliConsultationCreateRequest = {
    sectionName,
  };

  return requestJson<KundaliConsultationResponse>(
    `/api/kundali/order/${encodeURIComponent(orderId)}/consultation`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export function getLatestConsultationRequest(
  orderId: string
): Promise<KundaliConsultationResponse> {
  return requestJson<KundaliConsultationResponse>(
    `/api/kundali/order/${encodeURIComponent(orderId)}/consultation/latest`
  );
}
