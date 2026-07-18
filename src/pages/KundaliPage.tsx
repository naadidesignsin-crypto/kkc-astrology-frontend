import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import AstrologyServices from "../components/AstrologyServices";
import AstroBackground from "../components/AstroBackground";
import NavagrahaOrbit from "../components/NavagrahaOrbit";
import KundaliChartCard from "../components/KundaliChartCard";
import KundaliGeneratingLoader from "../components/KundaliGeneratingLoader";
import type { KundaliGenerationStage } from "../components/KundaliGeneratingLoader";
import FloatingAstrologyWhatsApp from "../components/FloatingAstrologyWhatsApp";
import ReportConsultationCard from "../components/ReportConsultationCard";
import HouseInterpretationSection from "../components/HouseInterpretationSection";
import GeneratedReportTabs from "../components/GeneratedReportTabs";
import type { ReportTabId } from "../components/GeneratedReportTabs";
import NavamsaChartCard from "../components/NavamsaChartCard";
import ParasharaInterpretationSection from "../components/ParasharaInterpretationSection";

import { uiText } from "../data/kundaliUiText";

import {
  downloadKundaliPdf,
  generateKundali,
  generateSection,
  getDasha,
  getDosha,
  getHouses,
  getNavamsa,
  getParashara,
  getPlanets,
  getSummary,
} from "../services/kundaliApi";

import { searchLocations } from "../services/locationApi";

import type { UiLanguage } from "../types/language";
import type { LocationSearchResponse } from "../types/location";

import type {
  DashaPeriod,
  KundaliDashaResponse,
  KundaliDoshaResponse,
  KundaliHouseResponse,
  KundaliNavamsaResponse,
  KundaliParasharaReportResponse,
  KundaliPlanetsResponse,
  KundaliSummaryResponse,
} from "../types/kundali";

import {
  toTeluguValue,
  translateKundaliSentence,
} from "../utils/kundaliTranslations";

import kkcLogo from "../assets/Logo.png";

type DisplayValueFn = (value?: string | number | boolean | null) => string;
type TextMap = typeof uiText["te"];

const fallbackLocation: LocationSearchResponse = {
  id: "fallback-hyderabad",
  displayName: "Hyderabad, Telangana, India",
  birthPlace: "Hyderabad, Telangana, India",
  latitude: 17.385,
  longitude: 78.4867,
  timezone: "Asia/Kolkata",
  city: "Hyderabad",
  state: "Telangana",
  country: "India",
  countryCode: "in",
  source: "Fallback",
};

const emptyForm = {
  fullName: "",
  gender: "",
  dateOfBirth: "",
  timeOfBirth: "",
  birthPlace: "",
  latitude: 0,
  longitude: 0,
  timezone: "Asia/Kolkata",
  language: "en",
};

function KundaliPage() {
  const [form, setForm] = useState(emptyForm);

  const [locationQuery, setLocationQuery] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSearchResponse | null>(null);
  const [locationResults, setLocationResults] = useState<
    LocationSearchResponse[]
  >([]);
  const [showLocationResults, setShowLocationResults] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const locationBoxRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [generationStage, setGenerationStage] =
    useState<KundaliGenerationStage>("creating");
  const [error, setError] = useState("");

  const [summary, setSummary] = useState<KundaliSummaryResponse | null>(null);
  const [planets, setPlanets] = useState<KundaliPlanetsResponse | null>(null);
  const [dasha, setDasha] = useState<KundaliDashaResponse | null>(null);
  const [dosha, setDosha] = useState<KundaliDoshaResponse | null>(null);
  const [houses, setHouses] = useState<KundaliHouseResponse | null>(null);
  const [navamsa, setNavamsa] = useState<KundaliNavamsaResponse | null>(null);
  const [parashara, setParashara] =
    useState<KundaliParasharaReportResponse | null>(null);
  const [activeReportTab, setActiveReportTab] =
    useState<ReportTabId>("summary");

  const [language, setLanguage] = useState<UiLanguage>("en");

  const t = uiText[language];
  const useTeluguValues = language === "te";

  const isFormValid =
    form.fullName.trim().length >= 2 &&
    form.gender.trim().length > 0 &&
    form.dateOfBirth.trim().length > 0 &&
    form.timeOfBirth.trim().length > 0 &&
    selectedLocation !== null &&
    Number.isFinite(form.latitude) &&
    Number.isFinite(form.longitude) &&
    form.timezone.trim().length > 0;

  useEffect(() => {
    const cleanQuery = locationQuery.trim();

    const selectedName = selectedLocation?.displayName?.trim();
    const selectedBirthPlace = selectedLocation?.birthPlace?.trim();

    const isAlreadySelected =
      selectedLocation &&
      (cleanQuery === selectedName || cleanQuery === selectedBirthPlace);

    if (isAlreadySelected) {
      setLocationResults([]);
      setShowLocationResults(false);
      setLocationError("");
      return;
    }

    if (cleanQuery.length < 3) {
      setLocationResults([]);
      setShowLocationResults(false);
      setLocationError("");
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(() => {
      void fetchLocationResults(cleanQuery, controller.signal);
    }, 700);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [locationQuery, selectedLocation, language]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        locationBoxRef.current &&
        !locationBoxRef.current.contains(event.target as Node)
      ) {
        setShowLocationResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function fetchLocationResults(query: string, signal: AbortSignal) {
    try {
      setLocationLoading(true);
      setLocationError("");

      const results = await searchLocations(query, 8, signal);

      setLocationResults(results);
      setShowLocationResults(true);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      setLocationResults([]);
      setShowLocationResults(true);
      setLocationError(
        language === "te"
          ? "స్థల వివరాలు పొందలేకపోయాం. మళ్లీ ప్రయత్నించండి."
          : "Unable to fetch location results. Try again."
      );
    } finally {
      setLocationLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid) {
      setError(
        language === "te"
          ? "దయచేసి పేరు, లింగం, తేదీ, సమయం మరియు జన్మ స్థలాన్ని పూర్తిగా ఇవ్వండి."
          : "Please enter name, gender, birth date, birth time, and select birth place from the list."
      );
      return;
    }

    setLoading(true);
    setGenerationStage("creating");
    setError("");

    setSummary(null);
    setPlanets(null);
    setDasha(null);
    setDosha(null);
    setHouses(null);
    setNavamsa(null);
    setParashara(null);
    setActiveReportTab("summary");

    const finalLocation = selectedLocation || fallbackLocation;

    const requestPayload = {
      ...form,
      fullName: form.fullName.trim(),
      gender: form.gender.trim(),
      birthPlace: finalLocation.birthPlace,
      latitude: finalLocation.latitude,
      longitude: finalLocation.longitude,
      timezone: finalLocation.timezone || "Asia/Kolkata",
      language: "en",
    };

    try {
      const generated = await generateKundali(requestPayload);

      if (generated.status !== "SUCCESS") {
        throw new Error(generated.errorMessage || t.generationFailed);
      }

      const reportId = generated.id;

      setGenerationStage("planets");
      await generateSection(reportId, "PLANETARY_POSITIONS");

      setGenerationStage("dasha");
      await generateSection(reportId, "DASHA");

      setGenerationStage("dosha");
      await generateSection(reportId, "DOSHA");

      setGenerationStage("fetching");

      const [
        summaryData,
        planetData,
        dashaData,
        doshaData,
        houseData,
        navamsaData,
        parasharaData,
      ] = await Promise.all([
        getSummary(reportId),
        getPlanets(reportId),
        getDasha(reportId),
        getDosha(reportId),
        getHouses(reportId),
        getNavamsa(reportId),
        getParashara(reportId),
      ]);

      setSummary(summaryData);
      setPlanets(planetData);
      setDasha(dashaData);
      setDosha(doshaData);
      setHouses(houseData);
      setNavamsa(navamsaData);
      setParashara(parasharaData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorFallback);
    } finally {
      setLoading(false);
    }
  }

  function displayValue(value?: string | number | boolean | null) {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return useTeluguValues ? toTeluguValue(value) : String(value);
  }

  function displaySentence(value?: string | null) {
    if (!value) {
      return "-";
    }

    return language === "te" ? translateKundaliSentence(value) : value;
  }

  function updateField(name: string, value: string) {
    setError("");

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function selectLocation(location: LocationSearchResponse) {
    setSelectedLocation(location);
    setLocationQuery(location.displayName || location.birthPlace);
    setLocationResults([]);
    setShowLocationResults(false);
    setLocationError("");
    setError("");

    setForm((current) => ({
      ...current,
      birthPlace: location.birthPlace,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone || "Asia/Kolkata",
    }));
  }

  function handleLocationInput(value: string) {
    setLocationQuery(value);
    setSelectedLocation(null);
    setLocationError("");
    setError("");

    if (value.trim().length < 3) {
      setLocationResults([]);
      setShowLocationResults(false);
    }

    setForm((current) => ({
      ...current,
      birthPlace: value,
      latitude: 0,
      longitude: 0,
      timezone: "Asia/Kolkata",
    }));
  }

  function openNativePicker(input: HTMLInputElement) {
    const pickerInput = input as HTMLInputElement & { showPicker?: () => void };
    pickerInput.showPicker?.();
  }

  return (
    <main className="kundali-page">
      <AstroBackground />
      <FloatingAstrologyWhatsApp language={language} />

      <header className="site-header">
        <a href="#top" className="brand-block" aria-label="KKC Astrology Home">
          <span className="brand-logo-wrap">
            <img src={kkcLogo} alt="KKC Astrology Logo" className="brand-logo" />
          </span>

          <span>
            <strong>{t.brandTitle}</strong>
            <small>{t.brandSubtitle}</small>
          </span>
        </a>

        <nav className="top-nav" aria-label="Main navigation">
          <a href="#navagraha">{language === "te" ? "నవగ్రహం" : "Navagraha"}</a>
          <a href="#services">{t.navServices}</a>
          <a href="#kundali-form">{t.navKundali}</a>
          <a href="#summary">{t.navSummary}</a>
          <a href="#kundali-chart">{language === "te" ? "చార్ట్" : "Chart"}</a>
          <a href="#navamsa">{language === "te" ? "నవాంశం" : "Navamsa"}</a>
          <a href="#parashara">
            {language === "te" ? "పరాశర" : "Parāśara"}
          </a>
          <a href="#houses">{language === "te" ? "భవాలు" : "Houses"}</a>
          <a href="#planets">{t.navPlanets}</a>
          <a href="#dasha">{t.navDasha}</a>
          <a href="#dosha">{t.navDosha}</a>
          <a href="#consultation">
            {language === "te" ? "సంప్రదించండి" : "Consult"}
          </a>
        </nav>

        <button
          type="button"
          className="language-toggle"
          onClick={() =>
            setLanguage((current) => (current === "te" ? "en" : "te"))
          }
        >
          {t.languageButton}
        </button>
      </header>

      <section className="hero-section" id="top">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroDescription}</p>
        </div>

        <div className="hero-note">
          <strong>{t.portalTitle}</strong>
          <span>{t.portalDescription}</span>
        </div>
      </section>

      <div className="astro-orb-card" aria-hidden="true">
        <div className="astro-orb">
          <span className="orb-center">ॐ</span>
          <span className="orb-ring orb-ring-one" />
          <span className="orb-ring orb-ring-two" />
          <span className="orb-ring orb-ring-three" />
          <span className="orb-dot orb-dot-one" />
          <span className="orb-dot orb-dot-two" />
          <span className="orb-dot orb-dot-three" />
        </div>
      </div>

      <NavagrahaOrbit language={language} />

      <AstrologyServices language={language} />

      <section className="content-grid">
        <form className="kundali-form" id="kundali-form" onSubmit={handleSubmit}>
          <h2>{t.formTitle}</h2>

          <label>
            {t.fullName}
            <input
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder={
                language === "te" ? "పూర్తి పేరు ఇవ్వండి" : "Enter full name"
              }
              required
            />
          </label>

          <label>
            {t.gender}
            <select
              value={form.gender}
              onChange={(event) => updateField("gender", event.target.value)}
              required
            >
              <option value="">
                {language === "te" ? "లింగం ఎంచుకోండి" : "Select gender"}
              </option>
              <option value="Male">{t.male}</option>
              <option value="Female">{t.female}</option>
            </select>
          </label>

          <label>
            {t.dateOfBirth}
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(event) =>
                updateField("dateOfBirth", event.target.value)
              }
              onClick={(event) => openNativePicker(event.currentTarget)}
              required
            />
          </label>

          <label>
            {t.timeOfBirth}
            <input
              type="time"
              step="1"
              value={form.timeOfBirth}
              onChange={(event) =>
                updateField("timeOfBirth", event.target.value)
              }
              onClick={(event) => openNativePicker(event.currentTarget)}
              required
            />
          </label>

          <label className="dynamic-location-label">
            {language === "te" ? "జన్మ స్థలం" : "Birth Place"}

            <div className="dynamic-location-box" ref={locationBoxRef}>
              <input
                value={locationQuery}
                onChange={(event) => handleLocationInput(event.target.value)}
                onFocus={() => {
                  if (!selectedLocation && locationQuery.trim().length >= 3) {
                    setShowLocationResults(true);
                  }
                }}
                placeholder={
                  language === "te"
                    ? "నగరం / గ్రామం / స్థలం టైప్ చేయండి"
                    : "Type city / village / birth place"
                }
                autoComplete="off"
                required
              />

              {locationLoading && (
                <span className="location-search-status">
                  {language === "te" ? "శోధిస్తున్నాం..." : "Searching..."}
                </span>
              )}

              {showLocationResults && (
                <div className="dynamic-location-results">
                  {locationError && <p>{locationError}</p>}

                  {!locationError &&
                    !locationLoading &&
                    !selectedLocation &&
                    locationQuery.trim().length >= 3 &&
                    locationResults.length === 0 && (
                      <p>
                        {language === "te"
                          ? "స్థలం కనిపించలేదు. మరింత స్పష్టంగా టైప్ చేయండి."
                          : "No location found. Type a more specific place name."}
                      </p>
                    )}

                  {!locationError &&
                    locationResults.map((location) => (
                      <button
                        type="button"
                        key={location.id}
                        onClick={() => selectLocation(location)}
                      >
                        <strong>{location.birthPlace}</strong>
                        <span>{location.displayName}</span>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </label>

          {selectedLocation && (
            <div className="selected-location-card">
              <span>
                {language === "te"
                  ? "ఎంచుకున్న జన్మ స్థలం"
                  : "Selected Birth Place"}
              </span>

              <strong>{selectedLocation.birthPlace}</strong>

              <small>
                {language === "te"
                  ? "అక్షాంశం, రేఖాంశం మరియు టైమ్‌జోన్ ఆటోమేటిక్‌గా తీసుకున్నాం."
                  : "Latitude, longitude, and timezone are auto-filled."}
              </small>
            </div>
          )}

          <details className="advanced-location-details">
            <summary>
              {language === "te" ? "అడ్వాన్స్డ్ వివరాలు" : "Advanced Details"}
            </summary>

            <div className="advanced-location-grid">
              <Info
                label={t.birthPlace}
                value={selectedLocation?.birthPlace || form.birthPlace || "-"}
              />
              <Info
                label={t.latitude}
                value={selectedLocation ? form.latitude : "-"}
              />
              <Info
                label={t.longitude}
                value={selectedLocation ? form.longitude : "-"}
              />
              <Info
                label={t.timezone}
                value={selectedLocation ? form.timezone : "-"}
              />
            </div>
          </details>

          <button type="submit" disabled={loading || !isFormValid}>
            {loading ? t.generating : t.generate}
          </button>

          {!isFormValid && (
            <p className="form-helper-message">
              {language === "te"
                ? "జాతకం రూపొందించడానికి పేరు, లింగం, తేదీ, సమయం మరియు జన్మ స్థలాన్ని పూర్తి చేయండి."
                : "Complete name, gender, birth date, birth time, and select birth place to generate Kundali."}
            </p>
          )}

          {error && <p className="error-message">{error}</p>}
        </form>

        <section className="result-panel">
          {!summary && !loading && (
            <div className="empty-card">
              <h2>{t.emptyTitle}</h2>
              <p>{t.emptyDescription}</p>
            </div>
          )}

          {loading && (
            <KundaliGeneratingLoader
              language={language}
              stage={generationStage}
            />
          )}

          {summary && (
            <GeneratedReportTabs
              language={language}
              activeTab={activeReportTab}
              onTabChange={setActiveReportTab}
              tabs={[
                {
                  id: "summary",
                  labelEn: "Summary",
                  labelTe: "సారాంశం",
                  content: (
                    <SummaryCard
                      summary={summary}
                      t={t}
                      displayValue={displayValue}
                    />
                  ),
                },
                {
                  id: "birth-chart",
                  labelEn: "Birth Chart",
                  labelTe: "జన్మ చార్ట్",
                  disabled: !planets,
                  content: planets ? (
                    <KundaliChartCard planets={planets} language={language} />
                  ) : null,
                },
                {
                  id: "navamsa",
                  labelEn: "Navamsa",
                  labelTe: "నవాంశం",
                  disabled: !navamsa,
                  content: navamsa ? (
                    <NavamsaChartCard navamsa={navamsa} language={language} />
                  ) : null,
                },
                {
                  id: "parashara",
                  labelEn: "Parāśara",
                  labelTe: "పరాశర",
                  disabled: !parashara,
                  content: parashara ? (
                    <ParasharaInterpretationSection
                      parashara={parashara}
                      language={language}
                    />
                  ) : null,
                },
                {
                  id: "houses",
                  labelEn: "Houses",
                  labelTe: "భవాలు",
                  disabled: !houses,
                  content: houses ? (
                    <HouseInterpretationSection
                      houses={houses}
                      language={language}
                    />
                  ) : null,
                },
                {
                  id: "planets",
                  labelEn: "Planets",
                  labelTe: "గ్రహాలు",
                  disabled: !planets,
                  content: planets ? (
                    <PlanetTable
                      planets={planets}
                      t={t}
                      displayValue={displayValue}
                    />
                  ) : null,
                },
                {
                  id: "dasha",
                  labelEn: "Dasha",
                  labelTe: "దశ",
                  disabled: !dasha,
                  content: dasha ? (
                    <DashaCard
                      dasha={dasha}
                      t={t}
                      displayValue={displayValue}
                    />
                  ) : null,
                },
                {
                  id: "dosha",
                  labelEn: "Dosha",
                  labelTe: "దోషం",
                  disabled: !dosha,
                  content: dosha ? (
                    <DoshaCard
                      dosha={dosha}
                      t={t}
                      displayValue={displayValue}
                      displaySentence={displaySentence}
                    />
                  ) : null,
                },
                {
                  id: "pdf",
                  labelEn: "PDF",
                  labelTe: "PDF",
                  content: (
                    <PdfDownloadCard summary={summary} language={language} />
                  ),
                },
                {
                  id: "consultation",
                  labelEn: "Consult",
                  labelTe: "సంప్రదించండి",
                  content: (
                    <ReportConsultationCard
                      language={language}
                      summary={summary}
                      planets={planets}
                      dasha={dasha}
                      dosha={dosha}
                    />
                  ),
                },
              ]}
            />
          )}
        </section>
      </section>
    </main>
  );
}

function SummaryCard({
  summary,
  t,
  displayValue,
}: {
  summary: KundaliSummaryResponse;
  t: TextMap;
  displayValue: DisplayValueFn;
}) {
  return (
    <div className="result-card" id="summary">
      <h2>{t.summaryTitle}</h2>

      <div className="detail-grid">
        <Info label={t.name} value={summary.fullName} />
        <Info label={t.birthPlace} value={summary.birthPlace} />
        <Info label={t.lagna} value={displayValue(summary.ascendant)} />
        <Info label={t.rashi} value={displayValue(summary.rashi)} />
        <Info label={t.nakshatra} value={displayValue(summary.nakshatra)} />
        <Info label={t.charan} value={summary.charan} />
        <Info label={t.signLord} value={displayValue(summary.signLord)} />
        <Info
          label={t.nakshatraLord}
          value={displayValue(summary.nakshatraLord)}
        />
        <Info label={t.tithi} value={displayValue(summary.tithi)} />
        <Info label={t.yoga} value={displayValue(summary.yoga)} />
        <Info label={t.karan} value={displayValue(summary.karan)} />
        <Info label={t.masa} value={displayValue(summary.masa)} />
        <Info label={t.sunrise} value={summary.sunrise} />
        <Info label={t.sunset} value={summary.sunset} />
      </div>
    </div>
  );
}

function PlanetTable({
  planets,
  t,
  displayValue,
}: {
  planets: KundaliPlanetsResponse;
  t: TextMap;
  displayValue: DisplayValueFn;
}) {
  return (
    <div className="result-card" id="planets">
      <h2>{t.planetsTitle}</h2>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t.planet}</th>
              <th>{t.degree}</th>
              <th>{t.rashi}</th>
              <th>{t.nakshatra}</th>
              <th>{t.house}</th>
              <th>{t.retrograde}</th>
              <th>{t.combust}</th>
              <th>{t.state}</th>
            </tr>
          </thead>

          <tbody>
            {planets.planets.map((planet) => (
              <tr key={`${planet.name}-${planet.longitude}`}>
                <td>{displayValue(planet.name)}</td>
                <td>{planet.degree}</td>
                <td>{displayValue(planet.rashi)}</td>
                <td>{displayValue(planet.nakshatra)}</td>
                <td>{planet.house}</td>
                <td>{planet.retrograde ? t.yes : t.no}</td>
                <td>{planet.combust ? t.yes : t.no}</td>
                <td>{displayValue(planet.planetState)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DashaCard({
  dasha,
  t,
  displayValue,
}: {
  dasha: KundaliDashaResponse;
  t: TextMap;
  displayValue: DisplayValueFn;
}) {
  return (
    <div className="result-card" id="dasha">
      <h2>{t.dashaTitle}</h2>

      {dasha.currentDasha && (
        <div className="highlight-box">
          <strong>
            {t.currentDasha}: {displayValue(dasha.currentDasha.planet)}
          </strong>
          <span>
            {dasha.currentDasha.startDate} {t.from}{" "}
            {dasha.currentDasha.endDate} {t.to}
          </span>
        </div>
      )}

      <div className="dasha-list">
        {dasha.dashaPeriods.map((period: DashaPeriod) => (
          <div
            className={period.active ? "dasha-item active" : "dasha-item"}
            key={`${period.planet}-${period.startDate}`}
          >
            <strong>{displayValue(period.planet)}</strong>
            <span>
              {period.startDate} → {period.endDate}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoshaCard({
  dosha,
  t,
  displayValue,
  displaySentence,
}: {
  dosha: KundaliDoshaResponse;
  t: TextMap;
  displayValue: DisplayValueFn;
  displaySentence: (value?: string | null) => string;
}) {
  return (
    <div className="result-card" id="dosha">
      <h2>{t.doshaTitle}</h2>

      <div className="detail-grid">
        <Info
          label={t.mangalDosha}
          value={dosha.mangalDoshaPresent ? t.present : t.notPresent}
        />
        <Info label={t.type} value={displayValue(dosha.type)} />
        <Info label={t.intensity} value={displayValue(dosha.intensity)} />
      </div>

      <p className="description-text">{displaySentence(dosha.reason)}</p>
      <p className="description-text muted">{displaySentence(dosha.info)}</p>
    </div>
  );
}

function PdfDownloadCard({
  summary,
  language,
}: {
  summary: KundaliSummaryResponse;
  language: UiLanguage;
}) {
  const isTelugu = language === "te";

  return (
    <div className="result-card pdf-download-card">
      <div>
        <p className="eyebrow">{isTelugu ? "PDF రిపోర్ట్" : "PDF Report"}</p>

        <h2>
          {isTelugu
            ? "జాతక PDF రిపోర్ట్ డౌన్‌లోడ్ చేయండి"
            : "Download Kundali PDF Report"}
        </h2>

        <p>
          {isTelugu
            ? "జాతక సారాంశం, గ్రహ స్థానాలు, భవాలు, దశ మరియు దోష వివరాలతో PDF పొందండి."
            : "Get a PDF with Kundali summary, planetary positions, houses, Dasha, and Dosha details."}
        </p>
      </div>

      <button type="button" onClick={() => downloadKundaliPdf(summary.id)}>
        {isTelugu ? "PDF డౌన్‌లోడ్" : "Download PDF"}
      </button>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="info-item">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

export default KundaliPage;