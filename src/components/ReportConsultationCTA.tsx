import type { KundaliSummaryResponse } from "../types/kundali";

type ReportConsultationCTAProps = {
  summary: KundaliSummaryResponse;
  sectionName: string;
  title?: string;
  description?: string;
};

const whatsappNumber =
  import.meta.env.VITE_KKC_WHATSAPP_NUMBER || "919700051668";

function ReportConsultationCTA({
  summary,
  sectionName,
  title = "Need expert interpretation?",
  description = "Share this section with KKC for a clear astrology consultation and practical guidance.",
}: ReportConsultationCTAProps) {
  const message = encodeURIComponent(
    `Namaste KKC, I want consultation for ${sectionName} in Kundali report ID ${summary.id}. Name: ${summary.fullName}. Birth place: ${summary.birthPlace}.`
  );

  const consultationUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <section className="report-consultation-cta">
      <div>
        <p className="report-section-kicker">Consultation Support</p>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>

      <a href={consultationUrl} target="_blank" rel="noreferrer">
        Consult on WhatsApp
      </a>
    </section>
  );
}

export default ReportConsultationCTA;