import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getDailyRasi } from "../services/rasiApi";
import type { DailyRasiResponse, DailyRasiSection } from "../types/rasi";
import { openWhatsAppShare } from "../utils/whatsappShare";

type RasiPeriod = "daily" | "weekly" | "monthly";

type ParsedRasiSection = {
  overview: string;
  career: string;
  finance: string;
  health: string;
  family: string;
  love: string;
  luckyColor: string;
  luckyNumber: string;
  luckyDirection: string;
  remedy: string;
};

type PlanetInfluence = {
  planet: string;
  description: string;
};

const rasiList = [
  { key: "mesha", telugu: "మేషం", english: "Mesha", zodiac: "Aries", symbol: "♈" },
  { key: "vrishabha", telugu: "వృషభం", english: "Vrishabha", zodiac: "Taurus", symbol: "♉" },
  { key: "mithuna", telugu: "మిథునం", english: "Mithuna", zodiac: "Gemini", symbol: "♊" },
  { key: "karkataka", telugu: "కర్కాటకం", english: "Karkataka", zodiac: "Cancer", symbol: "♋" },
  { key: "simha", telugu: "సింహం", english: "Simha", zodiac: "Leo", symbol: "♌" },
  { key: "kanya", telugu: "కన్య", english: "Kanya", zodiac: "Virgo", symbol: "♍" },
  { key: "tula", telugu: "తుల", english: "Tula", zodiac: "Libra", symbol: "♎" },
  { key: "vrischika", telugu: "వృశ్చికం", english: "Vrischika", zodiac: "Scorpio", symbol: "♏" },
  { key: "dhanu", telugu: "ధనుస్సు", english: "Dhanu", zodiac: "Sagittarius", symbol: "♐" },
  { key: "makara", telugu: "మకరం", english: "Makara", zodiac: "Capricorn", symbol: "♑" },
  { key: "kumbha", telugu: "కుంభం", english: "Kumbha", zodiac: "Aquarius", symbol: "♒" },
  { key: "meena", telugu: "మీనం", english: "Meena", zodiac: "Pisces", symbol: "♓" },
];

const rasiPlaces = [
  { label: "Hyderabad, Telangana", value: "hyderabad" },
  { label: "Warangal, Telangana", value: "warangal" },
  { label: "Vijayawada, Andhra Pradesh", value: "vijayawada" },
  { label: "Tirupati, Andhra Pradesh", value: "tirupati" },
  { label: "Visakhapatnam, Andhra Pradesh", value: "visakhapatnam" },
];

const periodLabels: Record<RasiPeriod, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

const inlineLabels = [
  "Career & Business",
  "Career and Business",
  "Business",
  "Career",
  "Profession",
  "Work",
  "Job",
  "Finance & Wealth",
  "Finance and Wealth",
  "Money & Finance",
  "Money and Finance",
  "Finance",
  "Money",
  "Wealth",
  "Income",
  "Health & Wellness",
  "Health and Wellness",
  "Health",
  "Family & Relationships",
  "Family and Relationships",
  "Family",
  "Relationships",
  "Relationship",
  "Love & Relationship",
  "Love and Relationship",
  "Love",
  "Lucky Color",
  "Lucky Colour",
  "Lucky Numbers",
  "Lucky Number",
  "Lucky Direction",
  "Remedy",
  "Remedies",
  "Suggestion",
];

const planetLabels = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

function getTodayLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cleanDisplayText(value?: string | number | null) {
  if (value === null || value === undefined) {
    return "";
  }

  let clean = String(value);

  clean = clean
    .replace(/\\u003c/gi, "<")
    .replace(/\\u003e/gi, ">")
    .replace(/\\u0026/gi, "&")
    .replace(/\\u0022/gi, '"')
    .replace(/\\u0027/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

  clean = clean
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li>/gi, "• ")
    .replace(/<[^>]*>/g, " ");

  clean = clean
    .replace(/[{}\[\]"]/g, " ")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\\t/g, " ")
    .replace(/\s*:\s*/g, ": ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return clean;
}

function removeHoroscopePrefix(value: string) {
  return value
    .replace(
      /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s+[A-Za-z]+\s+Horoscope\s*:\s*/i,
      ""
    )
    .replace(
      /^[A-Za-z]+\s+Horoscope\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s*:\s*/i,
      ""
    )
    .replace(/^[A-Za-z]+\s+Horoscope\s*\([^)]+\)\s*:\s*/i, "")
    .replace(/^[A-Za-z]+\s+Horoscope\s*:\s*/i, "")
    .replace(/^(Daily|Weekly|Monthly)\s+Prediction\s*:\s*/i, "")
    .trim();
}

function normalizeLabel(label: string): keyof ParsedRasiSection {
  const clean = label.toLowerCase().replace(/[^a-z]/g, "");

  if (
    clean.includes("career") ||
    clean.includes("business") ||
    clean.includes("profession") ||
    clean.includes("work") ||
    clean.includes("job")
  ) {
    return "career";
  }

  if (
    clean.includes("finance") ||
    clean.includes("money") ||
    clean.includes("wealth") ||
    clean.includes("income")
  ) {
    return "finance";
  }

  if (clean.includes("health") || clean.includes("wellness")) {
    return "health";
  }

  if (clean.includes("love")) {
    return "love";
  }

  if (clean.includes("family") || clean.includes("relationship")) {
    return "family";
  }

  if (clean.includes("luckycolor") || clean.includes("luckycolour")) {
    return "luckyColor";
  }

  if (clean.includes("luckynumber")) {
    return "luckyNumber";
  }

  if (clean.includes("luckydirection")) {
    return "luckyDirection";
  }

  if (
    clean.includes("remedy") ||
    clean.includes("remedies") ||
    clean.includes("suggestion")
  ) {
    return "remedy";
  }

  return "overview";
}

function parseInlinePrediction(
  section?: DailyRasiSection | null
): ParsedRasiSection {
  const overviewSource = cleanDisplayText(
    section?.overview || section?.rawSummary || ""
  );

  const result: ParsedRasiSection = {
    overview: removeHoroscopePrefix(overviewSource),
    career: cleanDisplayText(section?.career),
    finance: cleanDisplayText(section?.finance),
    health: cleanDisplayText(section?.health),
    family: cleanDisplayText(section?.family),
    love: cleanDisplayText(section?.love),
    luckyColor: cleanDisplayText(section?.luckyColor),
    luckyNumber: cleanDisplayText(section?.luckyNumber),
    luckyDirection: cleanDisplayText(section?.luckyDirection),
    remedy: cleanDisplayText(section?.remedy),
  };

  const sortedLabels = [...inlineLabels].sort((a, b) => b.length - a.length);

  const labelPattern = new RegExp(
    `(${sortedLabels.map(escapeRegex).join("|")})\\s*:`,
    "gi"
  );

  const matches = [...overviewSource.matchAll(labelPattern)];

  if (matches.length === 0) {
    return result;
  }

  result.overview = removeHoroscopePrefix(
    overviewSource.slice(0, matches[0].index).trim()
  );

  matches.forEach((match, index) => {
    const field = normalizeLabel(match[1]);

    if (field === "overview") {
      return;
    }

    const valueStart = (match.index || 0) + match[0].length;
    const valueEnd =
      index + 1 < matches.length
        ? matches[index + 1].index || overviewSource.length
        : overviewSource.length;

    const value = overviewSource
      .slice(valueStart, valueEnd)
      .replace(/^[\s,.;:-]+/, "")
      .replace(/[\s,.;:-]+$/, "")
      .trim();

    if (value) {
      result[field] = value;
    }
  });

  return result;
}

function parsePlanetInfluences(value?: string | null): {
  overview: string;
  influences: PlanetInfluence[];
} {
  const clean = cleanDisplayText(value);

  if (!clean) {
    return {
      overview: "",
      influences: [],
    };
  }

  const labelPattern = new RegExp(`(${planetLabels.join("|")})\\s*:`, "gi");
  const matches = [...clean.matchAll(labelPattern)];

  if (matches.length === 0) {
    return {
      overview: removeHoroscopePrefix(clean),
      influences: [],
    };
  }

  const overview = removeHoroscopePrefix(clean.slice(0, matches[0].index).trim());

  const influences: PlanetInfluence[] = matches.map((match, index) => {
    const planet = match[1];
    const valueStart = (match.index || 0) + match[0].length;
    const valueEnd =
      index + 1 < matches.length
        ? matches[index + 1].index || clean.length
        : clean.length;

    const description = clean
      .slice(valueStart, valueEnd)
      .replace(/\bDaily\b$/i, "")
      .replace(/\bWeekly\b$/i, "")
      .replace(/\bMonthly\b$/i, "")
      .replace(/^[\s,.;:-]+/, "")
      .replace(/[\s,.;:-]+$/, "")
      .trim();

    return {
      planet,
      description,
    };
  });

  return {
    overview,
    influences,
  };
}

function getParagraphs(value?: string | null, maxParagraphs = 4) {
  const clean = cleanDisplayText(value);

  if (!clean) {
    return [];
  }

  return clean
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => !item.includes("status:") && !item.includes("success:"))
    .slice(0, maxParagraphs);
}

function compactText(value?: string | number | null, maxLength = 260) {
  const clean = cleanDisplayText(value);

  if (!clean) {
    return "-";
  }

  if (clean.length <= maxLength) {
    return clean;
  }

  return `${clean.slice(0, maxLength).trim()}...`;
}

function getSection(data: DailyRasiResponse | null, period: RasiPeriod) {
  if (!data) {
    return null;
  }

  const section = data[period];

  if (section) {
    return section;
  }

  return {
    title: periodLabels[period],
    overview: data.overview || data.prediction,
    career: data.career,
    finance: data.finance,
    health: data.health,
    family: data.family,
    love: data.love,
    luckyColor: data.luckyColor,
    luckyNumber: data.luckyNumber,
    luckyDirection: data.luckyDirection,
    remedy: data.remedy,
  } satisfies DailyRasiSection;
}

function DailyRasiPhalalu({ fullPage = false }: { fullPage?: boolean }) {
  const [selectedDate, setSelectedDate] = useState(getTodayLocalDate());
  const [selectedPlace, setSelectedPlace] = useState("hyderabad");
  const [selectedRasi, setSelectedRasi] = useState("mesha");
  const [selectedPeriod, setSelectedPeriod] = useState<RasiPeriod>("daily");
  const [rasiData, setRasiData] = useState<DailyRasiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedRasiMeta = useMemo(
    () => rasiList.find((item) => item.key === selectedRasi) || rasiList[0],
    [selectedRasi]
  );

  const activeSection = getSection(rasiData, selectedPeriod);
  const parsedSection = parseInlinePrediction(activeSection);

  const planetWisePrediction = parsePlanetInfluences(
    parsedSection.overview || activeSection?.rawSummary
  );

  const overviewParagraphs = getParagraphs(
    planetWisePrediction.overview || parsedSection.overview,
    4
  );

  useEffect(() => {
    let cancelled = false;

    async function loadDailyRasi() {
      try {
        setLoading(true);
        setError("");

        const response = await getDailyRasi(
          selectedDate,
          selectedRasi,
          selectedPlace
        );

        if (!cancelled) {
          setRasiData(response);
        }
      } catch (err) {
        if (!cancelled) {
          setRasiData(null);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load Rasi details."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDailyRasi();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, selectedPlace, selectedRasi]);

  function shareRasiOnWhatsApp() {
    if (!rasiData) {
      return;
    }

    const message = `
KKC ${periodLabels[selectedPeriod]} Rasi Phalalu

Date: ${rasiData.date}
Place: ${rasiData.place}
Rasi: ${rasiData.displayName || `${selectedRasiMeta.telugu} / ${selectedRasiMeta.english}`}

Overview:
${parsedSection.overview || rasiData.overview || rasiData.prediction || "-"}

Career:
${parsedSection.career || rasiData.career || "-"}

Finance:
${parsedSection.finance || rasiData.finance || "-"}

Health:
${parsedSection.health || rasiData.health || "-"}

Family:
${parsedSection.family || rasiData.family || "-"}

Love:
${parsedSection.love || rasiData.love || "-"}

Lucky Color:
${parsedSection.luckyColor || rasiData.luckyColor || "-"}

Lucky Number:
${parsedSection.luckyNumber || rasiData.luckyNumber || "-"}

Lucky Direction:
${parsedSection.luckyDirection || rasiData.luckyDirection || "-"}

Remedy:
${parsedSection.remedy || rasiData.remedy || "-"}

- Kundalini Kriya Chaitanyam
`.trim();

    openWhatsAppShare(message);
  }

  return (
    <section className="kkc-daily-rasi-clean" id="daily-rasi">
      <div className="kkc-daily-rasi-clean-card">
        <div className="kkc-rasi-clean-head">
          <div>
            <p className="kkc-eyebrow">Daily Rasi Phalalu</p>

            <h2>12 Rasis Daily, Weekly and Monthly Updates</h2>

            <p>
              Select a Rasi and view clean Daily, Weekly and Monthly prediction
              details for the selected date and place.
            </p>

            {!fullPage && (
              <div className="kkc-rasi-full-action">
                <Link to="/rasi-phalalu">View Full Rasi Phalalu →</Link>
              </div>
            )}
          </div>

          <div className="kkc-rasi-clean-controls">
            <label>
              Date
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </label>

            <label>
              Place
              <select
                value={selectedPlace}
                onChange={(event) => setSelectedPlace(event.target.value)}
              >
                {rasiPlaces.map((place) => (
                  <option key={place.value} value={place.value}>
                    {place.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="kkc-rasi-clean-body">
          <div className="kkc-rasi-clean-grid">
            {rasiList.map((rasi) => (
              <button
                type="button"
                key={rasi.key}
                className={
                  selectedRasi === rasi.key
                    ? "kkc-rasi-clean-tile active"
                    : "kkc-rasi-clean-tile"
                }
                onClick={() => setSelectedRasi(rasi.key)}
              >
                <span>{rasi.symbol}</span>
                <strong>{rasi.telugu}</strong>
                <small>
                  {rasi.english} / {rasi.zodiac}
                </small>
              </button>
            ))}
          </div>

          <article className="kkc-rasi-clean-result">
            <div className="kkc-rasi-clean-result-head">
              <span>{selectedRasiMeta.symbol}</span>

              <div>
                <p className="kkc-eyebrow">Selected Rasi</p>
                <h3>
                  {selectedRasiMeta.telugu} / {selectedRasiMeta.english}
                </h3>
                <small>
                  {selectedRasiMeta.zodiac}
                  {rasiData ? ` · ${periodLabels[selectedPeriod]} · ${rasiData.date}` : ""}
                </small>
              </div>

              <button
                type="button"
                className="kkc-rasi-share-btn"
                onClick={shareRasiOnWhatsApp}
                disabled={!rasiData}
              >
                Share on WhatsApp
              </button>
            </div>

            <div className="kkc-rasi-period-tabs">
              {(["daily", "weekly", "monthly"] as RasiPeriod[]).map(
                (period) => (
                  <button
                    type="button"
                    key={period}
                    className={
                      selectedPeriod === period
                        ? "kkc-rasi-period-tab active"
                        : "kkc-rasi-period-tab"
                    }
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {periodLabels[period]}
                  </button>
                )
              )}
            </div>

            {loading && (
              <div className="kkc-rasi-clean-state">
                Loading Rasi details...
              </div>
            )}

            {error && !loading && (
              <div className="kkc-rasi-clean-state error">{error}</div>
            )}

            {rasiData && activeSection && !loading && !error && (
              <>
                <div className="kkc-rasi-clean-summary">
                  <InfoBox label="Date" value={rasiData.date} />
                  <InfoBox label="Place" value={rasiData.place} />
                  <InfoBox label="Rasi" value={rasiData.displayName} />
                  <InfoBox label="Period" value={periodLabels[selectedPeriod]} />
                </div>

                <div className="kkc-rasi-clean-prediction">
                  <h4>{activeSection.title || periodLabels[selectedPeriod]}</h4>

                  {overviewParagraphs.length > 0 ? (
                    overviewParagraphs.map((paragraph, index) => (
                      <p key={`${selectedRasi}-${selectedPeriod}-${index}`}>
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p>
                      {periodLabels[selectedPeriod]} prediction is being
                      prepared for this Rasi.
                    </p>
                  )}
                </div>

                {planetWisePrediction.influences.length > 0 && (
                  <div className="kkc-rasi-planet-influence">
                    <h4>Planetary Influence</h4>

                    <div className="kkc-rasi-planet-grid">
                      {planetWisePrediction.influences.map((item) => (
                        <article
                          className="kkc-rasi-planet-card"
                          key={`${selectedRasi}-${selectedPeriod}-${item.planet}`}
                        >
                          <span>{item.planet}</span>
                          <p>{item.description || "-"}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                <div className="kkc-rasi-clean-sections">
                  <MiniPrediction label="Career" value={parsedSection.career} />
                  <MiniPrediction label="Finance" value={parsedSection.finance} />
                  <MiniPrediction label="Health" value={parsedSection.health} />
                  <MiniPrediction label="Family" value={parsedSection.family} />
                  <MiniPrediction label="Love" value={parsedSection.love} />
                  <MiniPrediction
                    label="Lucky Color"
                    value={parsedSection.luckyColor}
                  />
                  <MiniPrediction
                    label="Lucky Number"
                    value={parsedSection.luckyNumber}
                  />
                  <MiniPrediction
                    label="Lucky Direction"
                    value={parsedSection.luckyDirection}
                  />
                  <MiniPrediction label="Remedy" value={parsedSection.remedy} />
                </div>
              </>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="kkc-rasi-clean-info">
      <span>{label}</span>
      <strong>{compactText(value, 120)}</strong>
    </div>
  );
}

function MiniPrediction({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="kkc-rasi-clean-mini">
      <span>{label}</span>
      <strong>{compactText(value, 260)}</strong>
    </div>
  );
}

export default DailyRasiPhalalu;