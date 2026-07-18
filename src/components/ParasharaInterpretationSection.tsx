import type {
  KundaliParasharaReportResponse,
  ParasharaSectionResponse,
} from "../types/kundali";
import type { UiLanguage } from "../types/language";
import { toTeluguValue } from "../utils/kundaliTranslations";

type ParasharaInterpretationSectionProps = {
  parashara: KundaliParasharaReportResponse;
  language: UiLanguage;
};

const SECTION_TITLE_TE: Record<string, string> = {
  CAREER: "వృత్తి మరియు ఉద్యోగ దిశ",
  MARRIAGE: "వివాహం మరియు సంబంధాలు",
  FINANCE: "ధనం, ఆదాయం మరియు లాభాలు",
  HEALTH: "ఆరోగ్యం మరియు శక్తి",
  EDUCATION: "విద్య, బుద్ధి మరియు అభ్యాసం",
  DHARMA_SPIRITUALITY: "ధర్మం, ఆధ్యాత్మికత మరియు అంతర్గత ఎదుగుదల",
  GENERAL_REMEDIES: "సాధారణ పరిహారాలు మరియు మార్గదర్శనం",
};

const SECTION_LABEL_TE: Record<string, string> = {
  CAREER: "వృత్తి",
  MARRIAGE: "వివాహం",
  FINANCE: "ధనం",
  HEALTH: "ఆరోగ్యం",
  EDUCATION: "విద్య",
  DHARMA_SPIRITUALITY: "ధర్మం",
  GENERAL_REMEDIES: "పరిహారాలు",
};

function ParasharaInterpretationSection({
  parashara,
  language,
}: ParasharaInterpretationSectionProps) {
  const isTelugu = language === "te";

  return (
    <div className="result-card parashara-section" id="parashara">
      <div className="parashara-heading">
        <div>
          <p className="eyebrow">
            {isTelugu ? "పరాశర జ్యోతిష్యం" : "Parāśara Interpretation"}
          </p>

          <h2>
            {isTelugu
              ? "జీవిత విభాగాల వారీగా జాతక విశ్లేషణ"
              : "Life-area Kundali Interpretation"}
          </h2>

          <p>
            {isTelugu
              ? "ఈ విభాగం లగ్నం, రాశి, నక్షత్రం, గ్రహ స్థానాలు, భవాలు, దశ మరియు నవాంశం ఆధారంగా రూపొందించబడింది."
              : "This section is generated using Lagna, Rashi, Nakshatra, planetary positions, houses, Dasha, and Navamsa data."}
          </p>
        </div>

        <div className="parashara-summary-box">
          <span>
            <strong>{isTelugu ? "లగ్నం" : "Lagna"}</strong>
            {displayValue(parashara.lagna, language)}
          </span>

          <span>
            <strong>{isTelugu ? "రాశి" : "Rashi"}</strong>
            {displayValue(parashara.rashi, language)}
          </span>

          <span>
            <strong>{isTelugu ? "నక్షత్రం" : "Nakshatra"}</strong>
            {displayValue(parashara.nakshatra, language)}
          </span>

          <span>
            <strong>{isTelugu ? "ప్రస్తుత దశ" : "Current Dasha"}</strong>
            {displayValue(parashara.currentDasha, language)}
          </span>
        </div>
      </div>

      <div className="parashara-card-grid">
        {parashara.sections.map((section) => (
          <ParasharaCard
            key={section.sectionKey}
            section={section}
            language={language}
          />
        ))}
      </div>
    </div>
  );
}

function ParasharaCard({
  section,
  language,
}: {
  section: ParasharaSectionResponse;
  language: UiLanguage;
}) {
  const isTelugu = language === "te";
  const title = isTelugu
    ? SECTION_TITLE_TE[section.sectionKey] || section.title
    : section.title;

  const label = isTelugu
    ? SECTION_LABEL_TE[section.sectionKey] || section.sectionKey
    : section.sectionKey.replaceAll("_", " ");

  return (
    <article className="parashara-card">
      <div className="parashara-card-top">
        <span>{label}</span>
        <h3>{title}</h3>
      </div>

      <p className="parashara-summary">{section.summary}</p>

      <div className="parashara-block">
        <h4>{isTelugu ? "ముఖ్య పరిశీలన ప్రాంతాలు" : "Focus Areas"}</h4>

        <div className="parashara-chip-list">
          {section.focusAreas.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <div className="parashara-block">
        <h4>{isTelugu ? "పరిశీలనలు" : "Observations"}</h4>

        <ul>
          {section.observations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="parashara-guidance">
        <strong>{isTelugu ? "మార్గదర్శనం" : "Guidance"}</strong>
        <p>{section.guidance}</p>
      </div>

      <div className="parashara-caution">
        <strong>{isTelugu ? "గమనిక" : "Caution"}</strong>
        <p>{section.caution}</p>
      </div>
    </article>
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

export default ParasharaInterpretationSection;