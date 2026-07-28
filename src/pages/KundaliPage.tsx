import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import kkcLogo from "../assets/Logo.png";
import {
  downloadKundaliPdf,
  generateKundali,
  getDasha,
  getDosha,
  getHouses,
  getNavamsa,
  getParashara,
  getPlanets,
  getSummary,
} from "../services/kundaliApi";
import { searchLocations } from "../services/locationApi";
import type { LocationSearchResponse } from "../types/location";
import type {
  KundaliDashaResponse,
  KundaliDoshaResponse,
  KundaliGenerateRequest,
  KundaliHouseResponse,
  KundaliNavamsaResponse,
  KundaliParasharaReportResponse,
  KundaliPlanetsResponse,
  KundaliSummaryResponse,
} from "../types/kundali";

import BlackWhiteCosmicBackground from "../components/BlackWhiteCosmicBackground";
import DarkDatePicker from "../components/DarkDatePicker";
import DarkSelect from "../components/DarkSelect";
import PlanetBadge from "../components/PlanetBadge";
import SouthIndianBirthChart from "../components/SouthIndianBirthChart";
import KundaliGenerationLoader from "../components/KundaliGenerationLoader";
import HouseReadingCard from "../components/HouseReadingCard";
import ParasharaChapterCard from "../components/ParasharaChapterCard";
import ReportConsultationCTA from "../components/ReportConsultationCTA";

type KundaliForm = KundaliGenerateRequest;

type ReportTabId =
  | "summary"
  | "birth-chart"
  | "navamsa"
  | "parashara"
  | "houses"
  | "planets"
  | "dasha"
  | "dosha"
  | "pdf"
  | "consultation";

const emptyForm: KundaliForm = {
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

const whatsappNumber =
  import.meta.env.VITE_KKC_WHATSAPP_NUMBER || "919700051668";

const whatsappMessage = encodeURIComponent(
  "Namaste KKC, I want to book an astrology consultation."
);

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

function KundaliPage() {
  const [form, setForm] = useState<KundaliForm>(emptyForm);

  const [locationQuery, setLocationQuery] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSearchResponse | null>(null);
  const [locationResults, setLocationResults] = useState<
    LocationSearchResponse[]
  >([]);
  const [showLocationResults, setShowLocationResults] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("");
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

  const locationBoxRef = useRef<HTMLDivElement | null>(null);

  const isFormValid =
    form.fullName.trim().length >= 2 &&
    form.gender.trim().length > 0 &&
    form.dateOfBirth.trim().length > 0 &&
    form.timeOfBirth.trim().length > 0 &&
    selectedLocation !== null &&
    Number.isFinite(form.latitude) &&
    Number.isFinite(form.longitude);

  useEffect(() => {
    const cleanQuery = locationQuery.trim();

    if (selectedLocation && cleanQuery === selectedLocation.displayName) {
      setLocationResults([]);
      setShowLocationResults(false);
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
    }, 650);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [locationQuery, selectedLocation]);

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
      setLocationError("Unable to fetch location results. Try again.");
    } finally {
      setLocationLoading(false);
    }
  }

  function updateField(name: keyof KundaliForm, value: string) {
    setError("");

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleLocationInput(value: string) {
    setLocationQuery(value);
    setSelectedLocation(null);
    setLocationError("");
    setError("");

    setForm((current) => ({
      ...current,
      birthPlace: value,
      latitude: 0,
      longitude: 0,
      timezone: "Asia/Kolkata",
    }));

    if (value.trim().length < 3) {
      setLocationResults([]);
      setShowLocationResults(false);
    }
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

  function openNativePicker(input: HTMLInputElement) {
    const pickerInput = input as HTMLInputElement & { showPicker?: () => void };
    pickerInput.showPicker?.();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!isFormValid) {
      setError(
        "Enter name, gender, birth date, birth time, and select birth place from the list."
      );
      return;
    }

    try {
      setLoading(true);
      setStage("Reading birth details");
      setError("");

      setSummary(null);
      setPlanets(null);
      setDasha(null);
      setDosha(null);
      setHouses(null);
      setNavamsa(null);
      setParashara(null);
      setActiveReportTab("summary");

      const payload: KundaliGenerateRequest = {
        ...form,
        fullName: form.fullName.trim(),
        gender: form.gender.trim(),
        birthPlace: selectedLocation?.birthPlace || form.birthPlace,
        latitude: selectedLocation?.latitude || form.latitude,
        longitude: selectedLocation?.longitude || form.longitude,
        timezone: selectedLocation?.timezone || form.timezone || "Asia/Kolkata",
        language: "en",
      };

      setStage("Generating basic Kundali report");
      const generated = await generateKundali(payload);

      if (generated.status !== "SUCCESS") {
        throw new Error(generated.errorMessage || "Kundali generation failed.");
      }

      const reportId = generated.id;

      setStage("Loading generated Order ID and approved access");
      const summaryData = await getSummary(reportId);

      setSummary(summaryData);
      setActiveReportTab(
        summaryData.showSummary !== false ? "summary" : "consultation"
      );

      setStage("Loading approved report sections");

      const sectionRequests: Promise<void>[] = [];

      if (
        summaryData.showBirthChart ||
        summaryData.showPlanets ||
        summaryData.showHouses ||
        summaryData.showNavamsa ||
        summaryData.showParashara
      ) {
        sectionRequests.push(
          getPlanets(reportId).then((planetData) => {
            setPlanets(planetData);
          })
        );
      }

      if (summaryData.showDasha || summaryData.showParashara) {
        sectionRequests.push(
          getDasha(reportId).then((dashaData) => {
            setDasha(dashaData);
          })
        );
      }

      if (summaryData.showDosha) {
        sectionRequests.push(
          getDosha(reportId).then((doshaData) => {
            setDosha(doshaData);
          })
        );
      }

      if (summaryData.showHouses) {
        sectionRequests.push(
          getHouses(reportId).then((houseData) => {
            setHouses(houseData);
          })
        );
      }

      if (summaryData.showNavamsa) {
        sectionRequests.push(
          getNavamsa(reportId).then((navamsaData) => {
            setNavamsa(navamsaData);
          })
        );
      }

      if (summaryData.showParashara) {
        sectionRequests.push(
          getParashara(reportId).then((parasharaData) => {
            setParashara(parasharaData);
          })
        );
      }

      await Promise.all(sectionRequests);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate Kundali. Try again."
      );
    } finally {
      setLoading(false);
      setStage("");
    }
  }

  return (
    <main className="kkc-kundali">
      <BlackWhiteCosmicBackground />

      <header className="kkc-header kkc-kundali-header">
        <Link to="/" className="kkc-brand" aria-label="Go to landing page">
          <img src={kkcLogo} alt="KKC Logo" />

          <span>
            <strong>KKC</strong>
            <small>Kundalini Kriya Chaitanyam</small>
          </span>
        </Link>

        <nav className="kkc-nav" aria-label="Kundali navigation">
          <Link to="/">Home</Link>
          <a href="#kundali-form">Generate</a>
          <a href="#kundali-report">Report</a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            Consultation
          </a>
        </nav>

        <a
          className="kkc-outline-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
        >
          Book Consultation
        </a>
      </header>

      <section className="kkc-kundali-hero">
        <div className="kkc-kundali-copy">
          <p className="kkc-eyebrow">Kundali Generation</p>

          <h1>Generate your Vedic birth chart</h1>

          <p>
            Enter birth details to generate a KKC Order ID. Basic birth details
            and consultation are visible immediately. Detailed tabs are shown
            only after admin approval.
          </p>
        </div>

        <form
          className="kkc-kundali-form"
          id="kundali-form"
          onSubmit={handleSubmit}
        >
          <h2>Birth Details</h2>

          <label>
            Full Name
            <input
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="Enter full name"
              required
            />
          </label>

          <DarkSelect
            label="Gender"
            value={form.gender}
            placeholder="Select gender"
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
            ]}
            onChange={(value) => updateField("gender", value)}
          />

          <div className="kkc-kundali-form-row">
            <DarkDatePicker
              label="Date of Birth"
              value={form.dateOfBirth}
              placeholder="Select date"
              onChange={(value) => updateField("dateOfBirth", value)}
            />

            <label>
              Time of Birth
              <input
                type="time"
                value={form.timeOfBirth}
                onClick={(event) => openNativePicker(event.currentTarget)}
                onChange={(event) =>
                  updateField("timeOfBirth", event.target.value)
                }
                required
              />
            </label>
          </div>

          <div
            className={
              showLocationResults ? "kkc-location-box open" : "kkc-location-box"
            }
            ref={locationBoxRef}
          >
            <label>
              Birth Place
              <input
                value={locationQuery}
                onChange={(event) => handleLocationInput(event.target.value)}
                onFocus={() => {
                  if (!selectedLocation && locationQuery.trim().length >= 3) {
                    setShowLocationResults(true);
                  }
                }}
                placeholder="Type city / village / birth place"
                autoComplete="off"
                required
              />
            </label>

            {locationLoading && (
              <p className="kkc-location-status">Searching location...</p>
            )}

            {showLocationResults && (
              <div className="kkc-location-results">
                {locationError && <p>{locationError}</p>}

                {!locationError &&
                  !locationLoading &&
                  locationResults.length === 0 && (
                    <p>No location found. Type a more specific place name.</p>
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

            {selectedLocation && (
              <div className="kkc-selected-location">
                <strong>Selected Birth Place</strong>
                <span>{selectedLocation.birthPlace}</span>
                <small>Latitude, longitude and timezone auto-filled.</small>
              </div>
            )}
          </div>

          {error && <p className="kkc-form-error">{error}</p>}

          <button type="submit" disabled={loading || !isFormValid}>
            {loading ? stage || "Generating..." : "Generate Kundali"}
          </button>

          {!isFormValid && (
            <small className="kkc-form-helper">
              Complete birth details and select birth place from the list.
            </small>
          )}
        </form>
      </section>

      <section className="kkc-kundali-report" id="kundali-report">
        {!summary && !loading && (
          <div className="kkc-empty-report">
            <p className="kkc-eyebrow">Kundali Report</p>
            <h2>Your generated report will appear here</h2>
            <p>
              Backend will generate a KKC Order ID. Basic birth details are
              visible after generation. Detailed tabs like Parāśara, Dasha,
              Dosha, Navamsa, planets and PDF are shown only after admin
              approval.
            </p>
          </div>
        )}

        {loading && <KundaliGenerationLoader stage={stage} />}

        {summary && (
          <ReportTabs
            summary={summary}
            planets={planets}
            dasha={dasha}
            dosha={dosha}
            houses={houses}
            navamsa={navamsa}
            parashara={parashara}
            activeTab={activeReportTab}
            setActiveTab={setActiveReportTab}
          />
        )}
      </section>
    </main>
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
    <div className="kkc-info-box">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

function ReportReadinessOverview({
  summary,
  planets,
  dasha,
  dosha,
  houses,
  navamsa,
  parashara,
}: {
  summary: KundaliSummaryResponse;
  planets: KundaliPlanetsResponse | null;
  dasha: KundaliDashaResponse | null;
  dosha: KundaliDoshaResponse | null;
  houses: KundaliHouseResponse | null;
  navamsa: KundaliNavamsaResponse | null;
  parashara: KundaliParasharaReportResponse | null;
}) {
  const items = [
    {
      label: "Basic Birth Details",
      enabled: summary.showSummary !== false,
      ready: Boolean(summary),
      detail: "Order ID, birth details, Lagna, Rashi and Nakshatra details",
    },
    {
      label: "Consultation",
      enabled: summary.showConsultation !== false,
      ready: summary.showConsultation !== false,
      detail: "WhatsApp consultation support",
    },
    {
      label: "Birth Chart",
      enabled: Boolean(summary.showBirthChart),
      ready: Boolean(summary.showBirthChart && planets),
      detail: "12-house visual Kundali chart",
    },
    {
      label: "Planetary Positions",
      enabled: Boolean(summary.showPlanets),
      ready: Boolean(summary.showPlanets && planets),
      detail: "Graha placement, Rashi, Nakshatra and house mapping",
    },
    {
      label: "House Analysis",
      enabled: Boolean(summary.showHouses),
      ready: Boolean(summary.showHouses && houses),
      detail: "House-wise meaning and interpretation",
    },
    {
      label: "Navamsa",
      enabled: Boolean(summary.showNavamsa),
      ready: Boolean(summary.showNavamsa && navamsa),
      detail: "D9 chart and Navamsa planet mapping",
    },
    {
      label: "Parāśara Reading",
      enabled: Boolean(summary.showParashara),
      ready: Boolean(summary.showParashara && parashara),
      detail: "Life-area interpretation and guidance",
    },
    {
      label: "Dasha",
      enabled: Boolean(summary.showDasha),
      ready: Boolean(summary.showDasha && dasha),
      detail: "Current and upcoming Vimshottari periods",
    },
    {
      label: "Dosha",
      enabled: Boolean(summary.showDosha),
      ready: Boolean(summary.showDosha && dosha),
      detail: "Mangal Dosha status and explanation",
    },
    {
      label: "PDF",
      enabled: Boolean(summary.showPdf),
      ready: Boolean(summary.showPdf),
      detail: "Downloadable Kundali report",
    },
  ];

  const approvedCount = items.filter((item) => item.enabled).length;
  const readyCount = items.filter((item) => item.enabled && item.ready).length;

  return (
    <section className="report-readiness-card">
      <div className="report-readiness-head">
        <div>
          <p className="report-section-kicker">Report Access</p>
          <h3>Admin-approved sections</h3>
          <p>
            {readyCount} of {approvedCount} approved sections are ready for
            review.
          </p>
        </div>

        <div className="report-readiness-score">
          <strong>
            {readyCount}/{approvedCount}
          </strong>
          <span>Ready</span>
        </div>
      </div>

      <div className="report-readiness-grid">
        {items.map((item) => (
          <div
            className={
              item.enabled && item.ready
                ? "report-readiness-item ready"
                : "report-readiness-item pending"
            }
            key={item.label}
          >
            <span>{item.enabled ? (item.ready ? "✓" : "…") : "×"}</span>

            <div>
              <strong>{item.label}</strong>
              <p>
                {item.enabled ? item.detail : "Locked until admin approval."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReportTabs({
  summary,
  planets,
  dasha,
  dosha,
  houses,
  navamsa,
  parashara,
  activeTab,
  setActiveTab,
}: {
  summary: KundaliSummaryResponse;
  planets: KundaliPlanetsResponse | null;
  dasha: KundaliDashaResponse | null;
  dosha: KundaliDoshaResponse | null;
  houses: KundaliHouseResponse | null;
  navamsa: KundaliNavamsaResponse | null;
  parashara: KundaliParasharaReportResponse | null;
  activeTab: ReportTabId;
  setActiveTab: (tab: ReportTabId) => void;
}) {
  const tabs: {
    id: ReportTabId;
    label: string;
    disabled?: boolean;
    visible: boolean;
  }[] = [
    {
      id: "summary",
      label: "Summary",
      visible: summary.showSummary !== false,
    },
    {
      id: "birth-chart",
      label: "Birth Chart",
      disabled: !planets,
      visible: Boolean(summary.showBirthChart),
    },
    {
      id: "navamsa",
      label: "Navamsa",
      disabled: !navamsa,
      visible: Boolean(summary.showNavamsa),
    },
    {
      id: "parashara",
      label: "Parāśara",
      disabled: !parashara,
      visible: Boolean(summary.showParashara),
    },
    {
      id: "houses",
      label: "Houses",
      disabled: !houses,
      visible: Boolean(summary.showHouses),
    },
    {
      id: "planets",
      label: "Planets",
      disabled: !planets,
      visible: Boolean(summary.showPlanets),
    },
    {
      id: "dasha",
      label: "Dasha",
      disabled: !dasha,
      visible: Boolean(summary.showDasha),
    },
    {
      id: "dosha",
      label: "Dosha",
      disabled: !dosha,
      visible: Boolean(summary.showDosha),
    },
    {
      id: "pdf",
      label: "PDF",
      visible: Boolean(summary.showPdf),
    },
    {
      id: "consultation",
      label: "Consultation",
      visible: summary.showConsultation !== false,
    },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);
  const selectedTab = visibleTabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : visibleTabs[0]?.id || "summary";

  const consultationMessage = encodeURIComponent(
    `Namaste KKC, I want consultation for Kundali report ID ${summary.id}. Order ID: ${summary.orderId}. Name: ${summary.fullName}`
  );

  const consultationUrl = `https://wa.me/${whatsappNumber}?text=${consultationMessage}`;

  return (
    <div className="kkc-report-experience">
      <section className="kkc-report-hero-card">
        <div className="kkc-report-hero-content">
          <p className="kkc-report-label">Generated Kundali Report</p>

          <h2>{summary.fullName}</h2>

          <p className="kkc-report-subtitle">
            Order ID: {summary.orderId} • {summary.birthPlace} •{" "}
            {summary.dateOfBirth} • {summary.timeOfBirth}
          </p>

          <dl className="kkc-report-key-stats">
            <div>
              <dt>Ascendant</dt>
              <dd>{summary.ascendant || "-"}</dd>
            </div>

            <div>
              <dt>Rashi</dt>
              <dd>{summary.rashi || "-"}</dd>
            </div>

            <div>
              <dt>Nakshatra</dt>
              <dd>{summary.nakshatra || "-"}</dd>
            </div>

            <div>
              <dt>Current Dasha</dt>
              <dd>
                {String(
                  parashara?.currentDasha || dasha?.currentDasha?.planet || "-"
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="kkc-report-hero-actions">
          {summary.showPdf && (
            <button type="button" onClick={() => downloadKundaliPdf(summary.id)}>
              Download PDF
            </button>
          )}

          {summary.showConsultation !== false && (
            <a href={consultationUrl} target="_blank" rel="noreferrer">
              Consult on WhatsApp
            </a>
          )}
        </div>
      </section>

      <ReportReadinessOverview
        summary={summary}
        planets={planets}
        dasha={dasha}
        dosha={dosha}
        houses={houses}
        navamsa={navamsa}
        parashara={parashara}
      />

      <ApprovalPendingCard summary={summary} />

      <section className="kkc-report-navigation">
        <div className="kkc-report-navigation-copy">
          <span>Explore Report</span>
          <p>Only admin-approved sections are visible for this Order ID.</p>
        </div>

        <div className="kkc-tabs" role="tablist" aria-label="Kundali report tabs">
          {visibleTabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              className={selectedTab === tab.id ? "kkc-tab active" : "kkc-tab"}
              disabled={tab.disabled}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <div className="kkc-tab-panel">
        {selectedTab === "summary" && summary.showSummary !== false && (
          <SummaryTab summary={summary} />
        )}

        {selectedTab === "birth-chart" && summary.showBirthChart && planets && (
          <BirthChartTab summary={summary} planets={planets} />
        )}

        {selectedTab === "navamsa" && summary.showNavamsa && navamsa && (
          <NavamsaTab summary={summary} navamsa={navamsa} />
        )}

        {selectedTab === "parashara" && summary.showParashara && parashara && (
          <ParasharaTab summary={summary} parashara={parashara} />
        )}

        {selectedTab === "houses" && summary.showHouses && houses && (
          <HousesTab summary={summary} houses={houses} />
        )}

        {selectedTab === "planets" && summary.showPlanets && planets && (
          <PlanetsTab summary={summary} planets={planets} />
        )}

        {selectedTab === "dasha" && summary.showDasha && dasha && (
          <DashaTab summary={summary} dasha={dasha} />
        )}

        {selectedTab === "dosha" && summary.showDosha && dosha && (
          <DoshaTab summary={summary} dosha={dosha} />
        )}

        {selectedTab === "pdf" && summary.showPdf && <PdfTab summary={summary} />}

        {selectedTab === "consultation" && summary.showConsultation !== false && (
          <ConsultationTab summary={summary} />
        )}
      </div>
    </div>
  );
}

function ApprovalPendingCard({ summary }: { summary: KundaliSummaryResponse }) {
  const hasAdvancedAccess =
    Boolean(summary.showBirthChart) ||
    Boolean(summary.showPlanets) ||
    Boolean(summary.showHouses) ||
    Boolean(summary.showNavamsa) ||
    Boolean(summary.showParashara) ||
    Boolean(summary.showDasha) ||
    Boolean(summary.showDosha) ||
    Boolean(summary.showPdf);

  if (hasAdvancedAccess) {
    return null;
  }

  return (
    <article className="kkc-report-section approval-pending-card">
      <p className="report-section-kicker">Admin Approval Required</p>
      <h3>Detailed Kundali sections are not approved yet</h3>
      <p>
        Basic birth details and consultation are available now. Birth Chart,
        Planets, Houses, Navamsa, Parāśara, Dasha, Dosha and PDF will appear
        only after admin approval for this Order ID.
      </p>
      <p>
        <strong>Order ID:</strong> {summary.orderId}
      </p>
    </article>
  );
}

function SummaryTab({ summary }: { summary: KundaliSummaryResponse }) {
  return (
    <>
      <div className="kkc-report-grid">
        <Info label="Order ID" value={summary.orderId} />
        <Info label="Ascendant" value={summary.ascendant} />
        <Info label="Rashi" value={summary.rashi} />
        <Info label="Sign Lord" value={summary.signLord} />
        <Info label="Nakshatra" value={summary.nakshatra} />
        <Info label="Nakshatra Lord" value={summary.nakshatraLord} />
        <Info label="Charan" value={summary.charan} />
        <Info label="Tithi" value={summary.tithi} />
        <Info label="Yoga" value={summary.yoga} />
        <Info label="Karan" value={summary.karan} />
        <Info label="Masa" value={summary.masa} />
        <Info label="Sunrise" value={summary.sunrise} />
        <Info label="Sunset" value={summary.sunset} />
      </div>

      <article className="kkc-report-section">
        <h3>Birth Details</h3>

        <div className="kkc-report-grid">
          <Info label="Name" value={summary.fullName} />
          <Info label="Gender" value={summary.gender} />
          <Info label="Date of Birth" value={summary.dateOfBirth} />
          <Info label="Time of Birth" value={summary.timeOfBirth} />
          <Info label="Birth Place" value={summary.birthPlace} />
          <Info label="Provider" value={summary.provider} />
        </div>
      </article>

      <ReportConsultationCTA
        summary={summary}
        sectionName="Kundali Summary"
        title="Need the birth summary explained?"
        description="Get Lagna, Rashi, Nakshatra, Tithi and basic birth details explained in simple language."
      />
    </>
  );
}

function BirthChartTab({
  summary,
  planets,
}: {
  summary: KundaliSummaryResponse;
  planets: KundaliPlanetsResponse;
}) {
  return (
    <article className="kkc-report-section astrology-chart-section">
      <div className="report-section-intro">
        <p className="report-section-kicker">Birth Chart</p>
        <h3>Rashi Chart / 12 Houses</h3>
        <p>
          This chart shows house-wise planetary placement generated from the
          birth details. Each planet is shown with its visual icon for easier
          reading.
        </p>
      </div>

      <SouthIndianBirthChart planets={planets} />

      <ReportConsultationCTA
        summary={summary}
        sectionName="Birth Chart"
        title="Need help reading this birth chart?"
        description="Get the 12-house chart, planet placements, career houses, marriage houses and core life areas explained clearly."
      />
    </article>
  );
}

function NavamsaTab({
  summary,
  navamsa,
}: {
  summary: KundaliSummaryResponse;
  navamsa: KundaliNavamsaResponse;
}) {
  return (
    <article className="kkc-report-section">
      <h3>Navamsa / D9</h3>

      <div className="kkc-report-grid">
        <Info label="Navamsa Ascendant" value={navamsa.navamsaAscendant} />
        <Info label="Status" value={navamsa.status} />
      </div>

      <div className="kkc-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Planet</th>
              <th>Birth Rashi</th>
              <th>Birth House</th>
              <th>Navamsa Number</th>
              <th>Navamsa Rashi</th>
              <th>Navamsa House</th>
            </tr>
          </thead>

          <tbody>
            {navamsa.planets.map((planet) => (
              <tr key={`${planet.planetName}-${planet.navamsaNumber}`}>
                <td>{planet.planetName}</td>
                <td>{planet.birthRashi}</td>
                <td>{planet.birthHouse || "-"}</td>
                <td>{planet.navamsaNumber}</td>
                <td>{planet.navamsaRashi}</td>
                <td>{planet.navamsaHouse || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReportConsultationCTA
        summary={summary}
        sectionName="Navamsa D9"
        title="Need Navamsa interpretation?"
        description="Get the D9 chart explained for marriage, dharma, inner strength and long-term life direction."
      />
    </article>
  );
}

function ParasharaTab({
  summary,
  parashara,
}: {
  summary: KundaliSummaryResponse;
  parashara: KundaliParasharaReportResponse;
}) {
  const sectionCount = parashara.sections?.length || 0;

  return (
    <article className="kkc-report-section parashara-report-section">
      <div className="report-section-intro">
        <p className="report-section-kicker">Parāśara Interpretation</p>
        <h3>Life-Area Report Chapters</h3>
        <p>
          This section converts the Kundali into structured Parāśara-style
          chapters for career, marriage, finance, health, education,
          spirituality and remedies.
        </p>
      </div>

      <div className="parashara-report-summary">
        <div>
          <span>Lagna</span>
          <strong>{parashara.lagna || "-"}</strong>
        </div>

        <div>
          <span>Rashi</span>
          <strong>{parashara.rashi || "-"}</strong>
        </div>

        <div>
          <span>Nakshatra</span>
          <strong>{parashara.nakshatra || "-"}</strong>
        </div>

        <div>
          <span>Current Dasha</span>
          <strong>{String(parashara.currentDasha || "-")}</strong>
        </div>

        <div>
          <span>Navamsa Ascendant</span>
          <strong>{parashara.navamsaAscendant || "-"}</strong>
        </div>

        <div>
          <span>Chapters</span>
          <strong>{sectionCount}</strong>
        </div>
      </div>

      <div className="parashara-section-note">
        <span>How to read this section</span>
        <p>
          Read the chapters in order. Start with Career and Marriage for
          practical direction, then continue with Finance, Health, Education,
          Dharma and Remedies.
        </p>
      </div>

      <div className="parashara-chapter-list">
        {parashara.sections.map((section, index) => (
          <ParasharaChapterCard
            key={section.sectionKey || `${section.title}-${index}`}
            section={section}
            chapterNumber={index + 1}
            defaultOpen={index === 0}
          />
        ))}
      </div>

      <ReportConsultationCTA
        summary={summary}
        sectionName="Parashara Interpretation"
        title="Need a full Parāśara reading?"
        description="Get career, marriage, finance, health, education, spirituality and remedies interpreted together."
      />
    </article>
  );
}

function HousesTab({
  summary,
  houses,
}: {
  summary: KundaliSummaryResponse;
  houses: KundaliHouseResponse;
}) {
  const occupiedHouses = houses.houses.filter(
    (house) => house.planets && house.planets.length > 0
  );

  const totalPlanetsInHouses = houses.houses.reduce(
    (count, house) => count + (house.planets?.length || 0),
    0
  );

  return (
    <article className="kkc-report-section houses-report-section">
      <div className="report-section-intro">
        <p className="report-section-kicker">House-wise Interpretation</p>
        <h3>12 Houses of the Kundali</h3>
        <p>
          Each house represents a specific life area. Expand a house to read its
          meaning, interpretation and planet placements.
        </p>
      </div>

      <div className="houses-report-summary">
        <div>
          <span>Total Houses</span>
          <strong>12</strong>
        </div>

        <div>
          <span>Occupied Houses</span>
          <strong>{occupiedHouses.length}</strong>
        </div>

        <div>
          <span>Planet Placements</span>
          <strong>{totalPlanetsInHouses}</strong>
        </div>

        <div>
          <span>Reading Style</span>
          <strong>Parāśara</strong>
        </div>
      </div>

      <div className="houses-section-note">
        <span>How to read this section</span>
        <p>
          Start with House 1, 4, 7 and 10 for core life direction. Then read
          House 5 and 9 for dharma, intelligence and fortune.
        </p>
      </div>

      <div className="house-accordion-grid">
        {houses.houses.map((house) => (
          <HouseReadingCard
            key={house.houseNumber}
            house={house}
            defaultOpen={house.houseNumber === 1}
          />
        ))}
      </div>

      <ReportConsultationCTA
        summary={summary}
        sectionName="House-wise Interpretation"
        title="Need house-wise guidance?"
        description="Get each important house explained for personality, career, marriage, finance, health and spiritual direction."
      />
    </article>
  );
}

function PlanetsTab({
  summary,
  planets,
}: {
  summary: KundaliSummaryResponse;
  planets: KundaliPlanetsResponse;
}) {
  return (
    <article className="kkc-report-section planets-report-section">
      <div className="report-section-intro">
        <p className="report-section-kicker">Planetary Positions</p>
        <h3>Planet Details</h3>
        <p>
          Planetary position, Rashi, Nakshatra, house placement and motion
          details.
        </p>
      </div>

      <div className="planet-card-grid">
        {planets.planets.map((planet) => (
          <div
            className="planet-detail-card"
            key={`${planet.name}-${planet.house}-${planet.longitude}`}
          >
            <div className="planet-detail-head">
              <PlanetBadge name={planet.name} />
              <span>House {planet.house || "-"}</span>
            </div>

            <div className="planet-detail-list">
              <Info label="Rashi" value={planet.rashi} />
              <Info label="Rashi Lord" value={planet.rashiLord} />
              <Info label="Nakshatra" value={planet.nakshatra} />
              <Info label="Nakshatra Lord" value={planet.nakshatraLord} />
              <Info label="Degree" value={planet.degree} />
              <Info label="Charan" value={planet.charan} />
              <Info label="Retrograde" value={planet.retrograde ? "Yes" : "No"} />
              <Info label="Combust" value={planet.combust ? "Yes" : "No"} />
            </div>
          </div>
        ))}
      </div>

      <ReportConsultationCTA
        summary={summary}
        sectionName="Planetary Positions"
        title="Need planet placement interpretation?"
        description="Get Rashi, Nakshatra, house placement, retrograde and combust details explained in practical terms."
      />
    </article>
  );
}

function DashaTab({
  summary,
  dasha,
}: {
  summary: KundaliSummaryResponse;
  dasha: KundaliDashaResponse;
}) {
  return (
    <article className="kkc-report-section">
      <div className="report-section-intro">
        <p className="report-section-kicker">Vimshottari Dasha</p>
        <h3>Dasha Timeline</h3>
        <p>
          Current and upcoming planetary periods based on Vimshottari Dasha.
        </p>
      </div>

      {dasha.currentDasha && (
        <div className="current-dasha-premium">
          <PlanetBadge name={dasha.currentDasha.planet} />
          <div>
            <span>Current Dasha</span>
            <strong>{dasha.currentDasha.planet}</strong>
            <p>
              {dasha.currentDasha.startDate} → {dasha.currentDasha.endDate}
            </p>
          </div>
        </div>
      )}

      <div className="dasha-timeline">
        {dasha.dashaPeriods.map((period) => (
          <div
            key={`${period.planet}-${period.startDate}`}
            className={period.active ? "dasha-period-card active" : "dasha-period-card"}
          >
            <PlanetBadge name={period.planet} compact />

            <div>
              <strong>{period.planet}</strong>
              <span>
                {period.startDate} → {period.endDate}
              </span>
            </div>
          </div>
        ))}
      </div>

      <ReportConsultationCTA
        summary={summary}
        sectionName="Vimshottari Dasha"
        title="Need Dasha timing guidance?"
        description="Get current and upcoming Dasha periods interpreted for decisions, timing and life direction."
      />
    </article>
  );
}

function DoshaTab({
  summary,
  dosha,
}: {
  summary: KundaliSummaryResponse;
  dosha: KundaliDoshaResponse;
}) {
  return (
    <article className="kkc-report-section">
      <div className="report-section-intro">
        <p className="report-section-kicker">Dosha Analysis</p>
        <h3>Mangal Dosha</h3>
        <p>
          Mangal Dosha status, intensity, type and explanation based on the
          generated Kundali.
        </p>
      </div>

      <div className="dosha-status-card">
        <div>
          <span>Status</span>
          <strong>
            {dosha.mangalDoshaPresent ? "Mangal Dosha Present" : "Mangal Dosha Not Present"}
          </strong>
        </div>

        <div>
          <span>Type</span>
          <strong>{dosha.type || "-"}</strong>
        </div>

        <div>
          <span>Intensity</span>
          <strong>{dosha.intensity || "-"}</strong>
        </div>
      </div>

      <div className="dosha-explanation">
        <h4>Reason</h4>
        <p>{dosha.reason || "Reason not available."}</p>

        <h4>Additional Information</h4>
        <p>{dosha.info || "Additional information not available."}</p>
      </div>

      <ReportConsultationCTA
        summary={summary}
        sectionName="Mangal Dosha Analysis"
        title="Need Dosha explanation?"
        description="Get Mangal Dosha status, intensity, impact and suitable guidance explained clearly."
      />
    </article>
  );
}

function PdfTab({ summary }: { summary: KundaliSummaryResponse }) {
  return (
    <article className="kkc-report-section kkc-pdf-tab">
      <p className="kkc-eyebrow">PDF Report</p>
      <h3>Download complete Kundali report</h3>
      <p>
        PDF access is available only when admin approves PDF visibility for this
        Order ID.
      </p>

      <div className="pdf-includes-grid">
        <span>✓ Birth Summary</span>
        <span>✓ Birth Chart</span>
        <span>✓ Planetary Positions</span>
        <span>✓ Navamsa / D9</span>
        <span>✓ Parāśara Reading</span>
        <span>✓ House Analysis</span>
        <span>✓ Vimshottari Dasha</span>
        <span>✓ Mangal Dosha</span>
      </div>

      <button type="button" onClick={() => downloadKundaliPdf(summary.id)}>
        Download Complete Report
      </button>

      <ReportConsultationCTA
        summary={summary}
        sectionName="Complete PDF Report"
        title="Need this PDF explained personally?"
        description="Share the downloaded Kundali report with KKC and get a guided explanation section by section."
      />
    </article>
  );
}

function ConsultationTab({ summary }: { summary: KundaliSummaryResponse }) {
  const message = encodeURIComponent(
    `Namaste KKC, I want consultation for Kundali report ID ${summary.id}. Order ID: ${summary.orderId}. Name: ${summary.fullName}`
  );

  const consultationUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <article className="kkc-report-section kkc-consultation-tab">
      <p className="kkc-eyebrow">Consultation</p>
      <h3>Need personal interpretation?</h3>
      <p>
        Share this Kundali report with KKC for detailed astrology consultation,
        remedies, Dasha guidance, marriage matching, or life direction.
      </p>

      <a
        className="kkc-primary-btn"
        href={consultationUrl}
        target="_blank"
        rel="noreferrer"
      >
        Consult on WhatsApp
      </a>
    </article>
  );
}

export default KundaliPage;