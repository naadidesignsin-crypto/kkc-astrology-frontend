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
  getReportByOrderId,
} from "../services/kundaliApi";
import {
  createConsultationRequest,
  getLatestConsultationRequest,
} from "../services/kundaliConsultationApi";
import { searchLocations } from "../services/locationApi";
import type { KundaliConsultationResponse } from "../types/kundaliConsultation";
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
  const [orderSearch, setOrderSearch] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchLocationResults(query: string, signal: AbortSignal) {
    try {
      setLocationLoading(true);
      setLocationError("");
      const results = await searchLocations(query, 8, signal);
      setLocationResults(results);
      setShowLocationResults(true);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setLocationResults([]);
      setShowLocationResults(true);
      setLocationError("Unable to fetch location results. Try again.");
    } finally {
      setLocationLoading(false);
    }
  }

  function updateField(name: keyof KundaliForm, value: string) {
    setError("");
    setForm((current) => ({ ...current, [name]: value }));
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

  function clearLoadedSections() {
    setPlanets(null);
    setDasha(null);
    setDosha(null);
    setHouses(null);
    setNavamsa(null);
    setParashara(null);
  }

  async function loadApprovedSections(summaryData: KundaliSummaryResponse) {
    const reportId = summaryData.id;
    const orderId = summaryData.orderId;
    const sectionRequests: Promise<void>[] = [];

    if (
      summaryData.showBirthChart ||
      summaryData.showPlanets ||
      summaryData.showHouses ||
      summaryData.showNavamsa ||
      summaryData.showParashara
    ) {
      sectionRequests.push(getPlanets(reportId, orderId).then(setPlanets));
    }

    if (summaryData.showDasha || summaryData.showParashara) {
      sectionRequests.push(getDasha(reportId, orderId).then(setDasha));
    }

    if (summaryData.showDosha) {
      sectionRequests.push(getDosha(reportId, orderId).then(setDosha));
    }

    if (summaryData.showHouses) {
      sectionRequests.push(getHouses(reportId, orderId).then(setHouses));
    }

    if (summaryData.showNavamsa) {
      sectionRequests.push(getNavamsa(reportId, orderId).then(setNavamsa));
    }

    if (summaryData.showParashara) {
      sectionRequests.push(getParashara(reportId, orderId).then(setParashara));
    }

    await Promise.all(sectionRequests);
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
      setCopyStatus("");
      setSummary(null);
      clearLoadedSections();
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

      setStage("Loading generated Order ID and approved access");
      const summaryData = await getReportByOrderId(generated.orderId);

      setSummary(summaryData);
      setOrderSearch(summaryData.orderId);
      setActiveReportTab(
        summaryData.showSummary !== false ? "summary" : "consultation"
      );

      setStage("Loading approved report sections");
      await loadApprovedSections(summaryData);
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

  async function handleOrderSearch(event: FormEvent) {
    event.preventDefault();

    if (orderSearch.trim().length < 8) {
      setError("Enter a valid KKC Order ID.");
      return;
    }

    try {
      setLoading(true);
      setStage("Searching report by Order ID");
      setError("");
      setCopyStatus("");
      setSummary(null);
      clearLoadedSections();
      setActiveReportTab("summary");

      const summaryData = await getReportByOrderId(orderSearch);

      setSummary(summaryData);
      setOrderSearch(summaryData.orderId);
      setActiveReportTab(
        summaryData.showSummary !== false ? "summary" : "consultation"
      );

      setStage("Loading approved report sections");
      await loadApprovedSections(summaryData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to find report for this Order ID."
      );
    } finally {
      setLoading(false);
      setStage("");
    }
  }

  async function copyOrderId(orderId: string) {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopyStatus("Order ID copied.");
    } catch {
      setCopyStatus("Copy failed. Select and copy the Order ID manually.");
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
          <a href="#order-search">Search</a>
          <a href="#kundali-report">Report</a>
          <a href="#order-search">Consultation</a>
        </nav>

        <a className="kkc-outline-btn" href="#order-search">
          Use Order ID
        </a>
      </header>

      <section className="kkc-kundali-hero">
        <div className="kkc-kundali-copy">
          <p className="kkc-eyebrow">Kundali Generation</p>
          <h1>Generate your Vedic birth chart</h1>
          <p>
            Generate a private KKC Order ID or search an existing Order ID.
            Consultation messages are created by the backend using saved birth
            details from that Order ID.
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

      <section className="kkc-kundali-report" id="order-search">
        <form className="kkc-order-search-card" onSubmit={handleOrderSearch}>
          <div>
            <p className="kkc-eyebrow">Find Existing Report</p>
            <h2>Search by Order ID</h2>
            <p>
              Enter the exact KKC Order ID to reopen the report and send saved
              basic birth details to WhatsApp for consultation.
            </p>
          </div>

          <label>
            Order ID
            <input
              value={orderSearch}
              onChange={(event) => setOrderSearch(event.target.value)}
              placeholder="Example: KKC-20260728-A8F3Q9"
              autoComplete="off"
            />
          </label>

          <button
            type="submit"
            disabled={loading || orderSearch.trim().length < 8}
          >
            Search Report
          </button>
        </form>
      </section>

      <section className="kkc-kundali-report" id="kundali-report">
        {!summary && !loading && (
          <div className="kkc-empty-report">
            <p className="kkc-eyebrow">Kundali Report</p>
            <h2>Your generated report will appear here</h2>
            <p>
              Generate a new Kundali or search using an existing Order ID.
              Consultation messages are saved in backend before WhatsApp opens.
            </p>
          </div>
        )}

        {loading && <KundaliGenerationLoader stage={stage} />}

        {summary && (
          <>
            <section className="kkc-order-save-card">
              <div>
                <p className="report-section-kicker">Save This Order ID</p>
                <h3>{summary.orderId}</h3>
                <p>
                  Save this Order ID. It is required to reopen the report and
                  to create WhatsApp consultation messages from backend data.
                </p>
                {copyStatus && <small>{copyStatus}</small>}
              </div>

              <button type="button" onClick={() => copyOrderId(summary.orderId)}>
                Copy Order ID
              </button>
            </section>

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
              onCopyOrderId={copyOrderId}
            />
          </>
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

function ConsultationActionButton({
  summary,
  sectionName,
  children,
}: {
  summary: KundaliSummaryResponse;
  sectionName: string;
  children: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    try {
      setLoading(true);
      setError("");

      const response = await createConsultationRequest(
        summary.orderId,
        sectionName
      );

      window.open(response.whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create consultation message."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button type="button" onClick={handleClick} disabled={loading}>
        {loading ? "Preparing WhatsApp..." : children}
      </button>
      {error && <small className="kkc-form-error">{error}</small>}
    </>
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
      detail: "Backend-created WhatsApp message with saved birth details",
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
              <p>{item.enabled ? item.detail : "Locked until admin approval."}</p>
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
  onCopyOrderId,
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
  onCopyOrderId: (orderId: string) => void;
}) {
  const tabs: {
    id: ReportTabId;
    label: string;
    disabled?: boolean;
    visible: boolean;
  }[] = [
    { id: "summary", label: "Summary", visible: summary.showSummary !== false },
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
    { id: "pdf", label: "PDF", visible: Boolean(summary.showPdf) },
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
          <button type="button" onClick={() => onCopyOrderId(summary.orderId)}>
            Copy Order ID
          </button>

          {summary.showPdf && (
            <button
              type="button"
              onClick={() => downloadKundaliPdf(summary.id, summary.orderId)}
            >
              Download PDF
            </button>
          )}

          {summary.showConsultation !== false && (
            <ConsultationActionButton
              summary={summary}
              sectionName="Generated Kundali Report"
            >
              Consult with this Order ID
            </ConsultationActionButton>
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

  if (hasAdvancedAccess) return null;

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
        title="Consult using this Order ID"
        description="Backend will fetch the saved basic birth details for this Order ID, save the WhatsApp message, and then open WhatsApp."
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
        <p>This chart shows house-wise planetary placement generated from the birth details.</p>
      </div>
      <SouthIndianBirthChart planets={planets} />
      <ReportConsultationCTA summary={summary} sectionName="Birth Chart" />
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
      <ReportConsultationCTA summary={summary} sectionName="Navamsa D9" />
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
  return (
    <article className="kkc-report-section parashara-report-section">
      <div className="report-section-intro">
        <p className="report-section-kicker">Parāśara Interpretation</p>
        <h3>Life-Area Report Chapters</h3>
        <p>Structured Parāśara-style chapters for practical interpretation.</p>
      </div>

      <div className="parashara-report-summary">
        <div><span>Lagna</span><strong>{parashara.lagna || "-"}</strong></div>
        <div><span>Rashi</span><strong>{parashara.rashi || "-"}</strong></div>
        <div><span>Nakshatra</span><strong>{parashara.nakshatra || "-"}</strong></div>
        <div><span>Current Dasha</span><strong>{String(parashara.currentDasha || "-")}</strong></div>
        <div><span>Navamsa Ascendant</span><strong>{parashara.navamsaAscendant || "-"}</strong></div>
        <div><span>Chapters</span><strong>{parashara.sections?.length || 0}</strong></div>
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
      <ReportConsultationCTA summary={summary} sectionName="Parashara Interpretation" />
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
  return (
    <article className="kkc-report-section houses-report-section">
      <div className="report-section-intro">
        <p className="report-section-kicker">House-wise Interpretation</p>
        <h3>12 Houses of the Kundali</h3>
        <p>Expand a house to read meaning, interpretation and planet placements.</p>
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
      <ReportConsultationCTA summary={summary} sectionName="House-wise Interpretation" />
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
        <p>Planetary position, Rashi, Nakshatra, house placement and motion details.</p>
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
      <ReportConsultationCTA summary={summary} sectionName="Planetary Positions" />
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
        <p>Current and upcoming planetary periods.</p>
      </div>
      {dasha.currentDasha && (
        <div className="current-dasha-premium">
          <PlanetBadge name={dasha.currentDasha.planet} />
          <div>
            <span>Current Dasha</span>
            <strong>{dasha.currentDasha.planet}</strong>
            <p>{dasha.currentDasha.startDate} → {dasha.currentDasha.endDate}</p>
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
              <span>{period.startDate} → {period.endDate}</span>
            </div>
          </div>
        ))}
      </div>
      <ReportConsultationCTA summary={summary} sectionName="Vimshottari Dasha" />
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
        <p>Mangal Dosha status, intensity, type and explanation.</p>
      </div>
      <div className="dosha-status-card">
        <div>
          <span>Status</span>
          <strong>
            {dosha.mangalDoshaPresent
              ? "Mangal Dosha Present"
              : "Mangal Dosha Not Present"}
          </strong>
        </div>
        <div><span>Type</span><strong>{dosha.type || "-"}</strong></div>
        <div><span>Intensity</span><strong>{dosha.intensity || "-"}</strong></div>
      </div>
      <div className="dosha-explanation">
        <h4>Reason</h4>
        <p>{dosha.reason || "Reason not available."}</p>
        <h4>Additional Information</h4>
        <p>{dosha.info || "Additional information not available."}</p>
      </div>
      <ReportConsultationCTA summary={summary} sectionName="Mangal Dosha Analysis" />
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
      <button
        type="button"
        onClick={() => downloadKundaliPdf(summary.id, summary.orderId)}
      >
        Download Complete Report
      </button>
      <ReportConsultationCTA summary={summary} sectionName="Complete PDF Report" />
    </article>
  );
}

function ConsultationTab({ summary }: { summary: KundaliSummaryResponse }) {
  const [latestMessage, setLatestMessage] =
    useState<KundaliConsultationResponse | null>(null);
  const [loadingLatest, setLoadingLatest] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadLatest() {
      try {
        setLoadingLatest(true);
        const response = await getLatestConsultationRequest(summary.orderId);
        if (!cancelled) {
          setLatestMessage(response);
        }
      } catch {
        if (!cancelled) {
          setLatestMessage(null);
        }
      } finally {
        if (!cancelled) {
          setLoadingLatest(false);
        }
      }
    }

    void loadLatest();

    return () => {
      cancelled = true;
    };
  }, [summary.orderId]);

  return (
    <article className="kkc-report-section kkc-consultation-tab">
      <p className="kkc-eyebrow">Consultation</p>
      <h3>Consult using saved Order ID data</h3>
      <p>
        Click the button below. The frontend will call backend first. Backend
        will fetch birth details by Order ID, save the WhatsApp message, and
        return the WhatsApp URL.
      </p>

      <div className="kkc-report-grid">
        <Info label="Order ID" value={summary.orderId} />
        <Info label="Name" value={summary.fullName} />
        <Info label="Date of Birth" value={summary.dateOfBirth} />
        <Info label="Time of Birth" value={summary.timeOfBirth} />
        <Info label="Birth Place" value={summary.birthPlace} />
      </div>

      <div className="kkc-report-hero-actions">
        <ConsultationActionButton
          summary={summary}
          sectionName="General Consultation"
        >
          Send Birth Details on WhatsApp
        </ConsultationActionButton>

        {latestMessage && (
          <button type="button" onClick={() => setShowMessage((value) => !value)}>
            {showMessage ? "Hide Last Message" : "View Last Message"}
          </button>
        )}
      </div>

      {loadingLatest && <small>Checking last saved consultation message...</small>}

      {latestMessage && (
        <p>
          Last saved message ID: <strong>{latestMessage.consultationId}</strong>
        </p>
      )}

      {showMessage && latestMessage && (
        <pre className="report-consultation-message">
          {latestMessage.whatsappMessage}
        </pre>
      )}
    </article>
  );
}

export default KundaliPage;
