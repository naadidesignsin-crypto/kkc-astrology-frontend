import { useEffect, useState } from "react";

import { createConsultationRequest, getLatestConsultationRequest } from "../services/kundaliConsultationApi";
import type { KundaliConsultationResponse } from "../types/kundaliConsultation";
import type { KundaliSummaryResponse } from "../types/kundali";

type ReportConsultationCTAProps = {
  summary: KundaliSummaryResponse;
  sectionName: string;
  title?: string;
  description?: string;
};

function ReportConsultationCTA({
  summary,
  sectionName,
  title = "Need expert interpretation?",
  description = "KKC will use the saved Order ID and backend birth details to prepare the WhatsApp consultation message.",
}: ReportConsultationCTAProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [latestMessage, setLatestMessage] =
    useState<KundaliConsultationResponse | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadLatestMessage() {
      if (!summary.orderId) {
        return;
      }

      try {
        const response = await getLatestConsultationRequest(summary.orderId);

        if (!cancelled) {
          setLatestMessage(response);
        }
      } catch {
        if (!cancelled) {
          setLatestMessage(null);
        }
      }
    }

    void loadLatestMessage();

    return () => {
      cancelled = true;
    };
  }, [summary.orderId]);

  async function handleConsultationClick() {
    try {
      setLoading(true);
      setError("");

      const response = await createConsultationRequest(
        summary.orderId,
        sectionName
      );

      setLatestMessage(response);
      window.open(response.whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create consultation WhatsApp message."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="report-consultation-cta">
      <div>
        <p className="report-section-kicker">Consultation Support</p>

        <h4>{title}</h4>

        <p>{description}</p>

        <small>
          Order ID: <strong>{summary.orderId || "-"}</strong>
        </small>

        {latestMessage && (
          <small>
            Last saved consultation message: #{latestMessage.consultationId}
          </small>
        )}

        {error && <small className="kkc-form-error">{error}</small>}
      </div>

      <div className="report-consultation-actions">
        <button
          type="button"
          onClick={handleConsultationClick}
          disabled={loading || !summary.orderId}
        >
          {loading ? "Preparing Message..." : "Send Details on WhatsApp"}
        </button>

        {latestMessage && (
          <button
            type="button"
            className="report-consultation-secondary"
            onClick={() => setShowMessage((current) => !current)}
          >
            {showMessage ? "Hide Last Message" : "View Last Message"}
          </button>
        )}
      </div>

      {showMessage && latestMessage && (
        <pre className="report-consultation-message">
          {latestMessage.whatsappMessage}
        </pre>
      )}
    </section>
  );
}

export default ReportConsultationCTA;
