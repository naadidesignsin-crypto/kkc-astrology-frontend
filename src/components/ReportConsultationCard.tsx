import type {
  KundaliDashaResponse,
  KundaliDoshaResponse,
  KundaliPlanetsResponse,
  KundaliSummaryResponse,
} from "../types/kundali";
import type { UiLanguage } from "../types/language";
import { toTeluguValue } from "../utils/kundaliTranslations";

type ReportConsultationCardProps = {
  language: UiLanguage;
  summary: KundaliSummaryResponse;
  planets?: KundaliPlanetsResponse | null;
  dasha?: KundaliDashaResponse | null;
  dosha?: KundaliDoshaResponse | null;
};

const whatsappNumber =
  import.meta.env.VITE_KKC_WHATSAPP_NUMBER || "919999999999";

function ReportConsultationCard({
  language,
  summary,
  planets,
  dasha,
  dosha,
}: ReportConsultationCardProps) {
  const isTelugu = language === "te";

  const lagna = displayValue(summary.ascendant, language);
  const rashi = displayValue(summary.rashi, language);
  const nakshatra = displayValue(summary.nakshatra, language);
  const currentDasha = dasha?.currentDasha?.planet
    ? displayValue(dasha.currentDasha.planet, language)
    : "-";

  const mangalDosha = dosha
    ? dosha.mangalDoshaPresent
      ? isTelugu
        ? "ఉంది"
        : "Present"
      : isTelugu
        ? "లేదు"
        : "Not Present"
    : "-";

  const planetCount = planets?.planets?.length || 0;

  const message = isTelugu
    ? [
        "Namaste KKC, నా జాతక రిపోర్ట్ గురించి సంప్రదించాలి.",
        `Name: ${summary.fullName}`,
        `Birth Place: ${summary.birthPlace}`,
        `Lagna: ${lagna}`,
        `Rashi: ${rashi}`,
        `Nakshatra: ${nakshatra}`,
        `Current Dasha: ${currentDasha}`,
        `Mangal Dosha: ${mangalDosha}`,
      ].join("\n")
    : [
        "Namaste KKC, I want to consult about my Kundali report.",
        `Name: ${summary.fullName}`,
        `Birth Place: ${summary.birthPlace}`,
        `Lagna: ${lagna}`,
        `Rashi: ${rashi}`,
        `Nakshatra: ${nakshatra}`,
        `Current Dasha: ${currentDasha}`,
        `Mangal Dosha: ${mangalDosha}`,
      ].join("\n");

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="report-consultation-card" id="consultation">
      <div className="consultation-orb-small" aria-hidden="true">
        <span>ॐ</span>
      </div>

      <div className="report-consultation-copy">
        <p className="eyebrow">
          {isTelugu ? "తదుపరి మార్గదర్శనం" : "Next Guidance"}
        </p>

        <h2>
          {isTelugu
            ? "ఈ జాతక రిపోర్ట్‌పై వ్యక్తిగత సంప్రదింపు కావాలా?"
            : "Need a personal consultation on this Kundali report?"}
        </h2>

        <p>
          {isTelugu
            ? "లగ్నం, రాశి, నక్షత్రం, దశ, మంగళ దోషం గురించి వివరంగా తెలుసుకోవడానికి KKC జ్యోతిష్య బృందాన్ని WhatsApp ద్వారా సంప్రదించండి."
            : "Contact the KKC astrology team on WhatsApp to understand Lagna, Rashi, Nakshatra, Dasha, and Mangal Dosha in detail."}
        </p>

        <div className="report-mini-summary">
          <span>
            <strong>{isTelugu ? "లగ్నం" : "Lagna"}</strong>
            {lagna}
          </span>

          <span>
            <strong>{isTelugu ? "రాశి" : "Rashi"}</strong>
            {rashi}
          </span>

          <span>
            <strong>{isTelugu ? "నక్షత్రం" : "Nakshatra"}</strong>
            {nakshatra}
          </span>

          <span>
            <strong>{isTelugu ? "గ్రహాలు" : "Planets"}</strong>
            {planetCount}
          </span>
        </div>
      </div>

      <div className="report-consultation-actions">
        <a href={whatsappUrl} target="_blank" rel="noreferrer">
          {isTelugu ? "WhatsAppలో సంప్రదించండి" : "Consult on WhatsApp"}
        </a>

        <a href="#kundali-form" className="secondary-consult-link">
          {isTelugu ? "మరొక జాతకం రూపొందించండి" : "Generate another Kundali"}
        </a>
      </div>
    </div>
  );
}

function displayValue(
  value: string | number | boolean | null | undefined,
  language: UiLanguage
) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return language === "te" ? toTeluguValue(value) : String(value);
}

export default ReportConsultationCard;