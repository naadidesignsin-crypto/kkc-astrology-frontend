import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import GeneratedReportTabs from "../components/GeneratedReportTabs";
import type { ReportTabId } from "../components/GeneratedReportTabs";
import KundaliChartCard from "../components/KundaliChartCard";
import KundaliGeneratingLoader from "../components/KundaliGeneratingLoader";
import type { KundaliGenerationStage } from "../components/KundaliGeneratingLoader";
import NavamsaChartCard from "../components/NavamsaChartCard";
import ParasharaInterpretationSection from "../components/ParasharaInterpretationSection";
import HouseInterpretationSection from "../components/HouseInterpretationSection";
import ReportConsultationCard from "../components/ReportConsultationCard";
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
import type { LocationSearchResponse } from "../types/location";
import type {
  DashaPeriod,
  KundaliDashaResponse,
  KundaliDoshaResponse,
  KundaliGenerateRequest,
  KundaliHouseResponse,
  KundaliNavamsaResponse,
  KundaliParasharaReportResponse,
  KundaliPlanetsResponse,
  KundaliSummaryResponse,
} from "../types/kundali";

const emptyForm: KundaliGenerateRequest = {
  orderId: "",
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
  const [form, setForm] = useState<KundaliGenerateRequest>(emptyForm);

  const [locationQuery, setLocationQuery] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSearchResponse | null>(null);
  const [locationResults, setLocationResults] = useState<LocationSearchResponse[]>([]);
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

  const isFormValid =
    form.orderId.trim().length >= 3 &&
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

  function updateField(name: keyof KundaliGenerateRequest, value: string) {
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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!isFormValid) {
      setError(
        "Enter Order ID, name, gender, birth date, birth time, and select birth place from the list."
      );
      return;
    }

    try {
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

      const payload: KundaliGenerateRequest = {
        ...form,
        orderId: form.orderId.trim(),
        fullName: form.fullName.trim(),
        gender: form.gender.trim(),
        birthPlace: selectedLocation?.birthPlace || form.birthPlace,
        latitude: selectedLocation?.latitude || form.latitude,
        longitude: selectedLocation?.longitude || form.longitude,
        timezone: selectedLocation?.timezone || form.timezone || "Asia/Kolkata",
        language: "en",
      };

      const generated = await generateKundali(payload);

      if (generated.status !== "SUCCESS") {
        throw new Error(generated.errorMessage || "Kundali generation failed.");
      }

      const reportId = generated.id;

      const summaryData = await getSummary(reportId);
      setSummary(summaryData);

      if (summaryData.showBirthChart || summaryData.showPlanets || summaryData.showHouses) {
        setGenerationStage("planets");
        await generateSection(reportId, "PLANETARY_POSITIONS");
        const planetData = await getPlanets(reportId);
        setPlanets(planetData);
      }

      if (summaryData.showDasha) {
        setGenerationStage("dasha");
        await generateSection(reportId, "DASHA");
        const dashaData = await getDasha(reportId);
        setDasha(dashaData);
      }

      if (summaryData.showDosha) {
        setGenerationStage("dosha");
        await generateSection(reportId, "DOSHA");
        const doshaData = await getDosha(reportId);
        setDosha(doshaData);
      }

      setGenerationStage("fetching");

      if (summaryData.showHouses) {
        setHouses(await getHouses(reportId));
      }

      if (summaryData.showNavamsa) {
        setNavamsa(await getNavamsa(reportId));
      }

      if (summaryData.showParashara) {
        setParashara(await getParashara(reportId));
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate Kundali. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="kundali-page">
      <section className="kundali-hero-section">
        <div className="kundali-hero-copy">
          <p className="eyebrow">Kundali Generation</p>
          <h1>Generate your Vedic birth chart</h1>
          <p>
            Enter your Order ID and birth details. Basic details are visible
            immediately. Detailed sections appear only after admin approval.
          </p>
        </div>

        <form className="kundali-form-card" id="kundali-form" onSubmit={handleSubmit}>
          <h2>Birth Details</h2>

          <label>
            Order ID
            <input
              value={form.orderId}
              onChange={(event) => updateField("orderId", event.target.value)}
              placeholder="Enter Order ID"
              required
            />
          </label>

          <label>
            Full Name
            <input
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="Enter full name"
              required
            />
          </label>

          <label>
            Gender
            <select
              value={form.gender}
              onChange={(event) => updateField("gender", event.target.value)}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>

          <div className="kundali-form-row">
            <label>
              Date of Birth
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(event) =>
                  updateField("dateOfBirth", event.target.value)
                }
                required
              />
            </label>

            <label>
              Time of Birth
              <input
                type="time"
                value={form.timeOfBirth}
                onChange={(event) =>
                  updateField("timeOfBirth", event.target.value)
                }
                required
              />
            </label>
          </div>

          <div
            className={showLocationResults ? "kkc-location-box open" : "kkc-location-box"}
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
            {loading ? "Generating..." : "Generate Kundali"}
          </button>

          {!isFormValid && (
            <small className="kkc-form-helper">
              Complete Order ID, birth details and select birth place from the list.
            </small>
          )}
        </form>
      </section>

      <section className="kundali-report-section" id="kundali-report">
        {!summary && !loading && (
          <article className="result-card">
            <p className="eyebrow">Kundali Report</p>
            <h2>Your generated report will appear here</h2>
            <p>
              Basic birth details will appear after generation. Detailed tabs are
              controlled by admin approval.
            </p>
          </article>
        )}

        {loading && (
          <KundaliGeneratingLoader language="en" stage={generationStage} />
        )}

        {summary && (
          <ReportWorkspace
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

function ReportWorkspace({
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
  const tabs = [
    {
      id: "summary" as ReportTabId,
      labelEn: "Summary",
      labelTe: "సారాంశం",
      visible: summary.showSummary,
      content: <SummaryCard summary={summary} />,
    },
    {
      id: "birth-chart" as ReportTabId,
      labelEn: "Birth Chart",
      labelTe: "జన్మ చార్ట్",
      visible: summary.showBirthChart,
      disabled: !planets,
      content: planets ? <KundaliChartCard planets={planets} language="en" /> : null,
    },
    {
      id: "navamsa" as ReportTabId,
      labelEn: "Navamsa",
      labelTe: "నవాంశం",
      visible: summary.showNavamsa,
      disabled: !navamsa,
      content: navamsa ? <NavamsaChartCard navamsa={navamsa} language="en" /> : null,
    },
    {
      id: "parashara" as ReportTabId,
      labelEn: "Parāśara",
      labelTe: "పరాశర",
      visible: summary.showParashara,
      disabled: !parashara,
      content: parashara ? (
        <ParasharaInterpretationSection parashara={parashara} language="en" />
      ) : null,
    },
    {
      id: "houses" as ReportTabId,
      labelEn: "Houses",
      labelTe: "భవాలు",
      visible: summary.showHouses,
      disabled: !houses,
      content: houses ? <HouseInterpretationSection houses={houses} language="en" /> : null,
    },
    {
      id: "planets" as ReportTabId,
      labelEn: "Planets",
      labelTe: "గ్రహాలు",
      visible: summary.showPlanets,
      disabled: !planets,
      content: planets ? <PlanetTable planets={planets} /> : null,
    },
    {
      id: "dasha" as ReportTabId,
      labelEn: "Dasha",
      labelTe: "దశ",
      visible: summary.showDasha,
      disabled: !dasha,
      content: dasha ? <DashaCard dasha={dasha} /> : null,
    },
    {
      id: "dosha" as ReportTabId,
      labelEn: "Dosha",
      labelTe: "దోషం",
      visible: summary.showDosha,
      disabled: !dosha,
      content: dosha ? <DoshaCard dosha={dosha} /> : null,
    },
    {
      id: "pdf" as ReportTabId,
      labelEn: "PDF",
      labelTe: "PDF",
      visible: summary.showPdf,
      content: <PdfDownloadCard summary={summary} />,
    },
    {
      id: "consultation" as ReportTabId,
      labelEn: "Consult",
      labelTe: "సంప్రదించండి",
      visible: summary.showConsultation,
      content: (
        <ReportConsultationCard
          language="en"
          summary={summary}
          planets={planets}
          dasha={dasha}
          dosha={dosha}
        />
      ),
    },
  ].filter((tab) => tab.visible);

  const activeVisible = tabs.some((tab) => tab.id === activeTab);

  useEffect(() => {
    if (!activeVisible && tabs.length > 0) {
      setActiveTab(tabs[0].id);
    }
  }, [activeVisible, setActiveTab, tabs]);

  return (
    <>
      <GeneratedReportTabs
        language="en"
        activeTab={activeVisible ? activeTab : tabs[0]?.id || "summary"}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      <ApprovalPendingCard summary={summary} />
    </>
  );
}

function ApprovalPendingCard({ summary }: { summary: KundaliSummaryResponse }) {
  const advancedVisible =
    summary.showBirthChart ||
    summary.showPlanets ||
    summary.showHouses ||
    summary.showNavamsa ||
    summary.showParashara ||
    summary.showDasha ||
    summary.showDosha ||
    summary.showPdf;

  if (advancedVisible) {
    return null;
  }

  return (
    <article className="result-card approval-pending-card">
      <p className="eyebrow">Admin Approval Required</p>
      <h2>Detailed Kundali sections are not approved yet</h2>
      <p>
        Basic birth details and consultation are available now. Detailed sections
        like Birth Chart, Planets, Houses, Navamsa, Parāśara, Dasha, Dosha and
        PDF will appear only after admin approval.
      </p>
      <p>
        <strong>Order ID:</strong> {summary.orderId}
      </p>
    </article>
  );
}

function SummaryCard({ summary }: { summary: KundaliSummaryResponse }) {
  return (
    <article className="result-card">
      <p className="eyebrow">Basic Birth Details</p>
      <h2>{summary.fullName}</h2>

      <div className="result-grid">
        <Info label="Order ID" value={summary.orderId} />
        <Info label="Gender" value={summary.gender} />
        <Info label="Date of Birth" value={summary.dateOfBirth} />
        <Info label="Time of Birth" value={summary.timeOfBirth} />
        <Info label="Birth Place" value={summary.birthPlace} />
        <Info label="Provider" value={summary.provider} />
        <Info label="Ascendant" value={summary.ascendant} />
        <Info label="Rashi" value={summary.rashi} />
        <Info label="Sign Lord" value={summary.signLord} />
        <Info label="Nakshatra" value={summary.nakshatra} />
        <Info label="Nakshatra Lord" value={summary.nakshatraLord} />
        <Info label="Tithi" value={summary.tithi} />
        <Info label="Yoga" value={summary.yoga} />
        <Info label="Karan" value={summary.karan} />
        <Info label="Sunrise" value={summary.sunrise} />
        <Info label="Sunset" value={summary.sunset} />
      </div>
    </article>
  );
}

function PlanetTable({ planets }: { planets: KundaliPlanetsResponse }) {
  return (
    <article className="result-card">
      <h2>Planetary Positions</h2>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Planet</th>
              <th>Degree</th>
              <th>Rashi</th>
              <th>Nakshatra</th>
              <th>House</th>
              <th>Retrograde</th>
              <th>Combust</th>
              <th>State</th>
            </tr>
          </thead>

          <tbody>
            {planets.planets.map((planet) => (
              <tr key={`${planet.name}-${planet.longitude}`}>
                <td>{planet.name}</td>
                <td>{planet.degree}</td>
                <td>{planet.rashi}</td>
                <td>{planet.nakshatra}</td>
                <td>{planet.house}</td>
                <td>{planet.retrograde ? "Yes" : "No"}</td>
                <td>{planet.combust ? "Yes" : "No"}</td>
                <td>{planet.planetState}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function DashaCard({ dasha }: { dasha: KundaliDashaResponse }) {
  return (
    <article className="result-card">
      <h2>Dasha</h2>

      {dasha.currentDasha && (
        <p>
          <strong>Current Dasha:</strong> {dasha.currentDasha.planet}{" "}
          {dasha.currentDasha.startDate} → {dasha.currentDasha.endDate}
        </p>
      )}

      <div className="result-grid">
        {dasha.dashaPeriods.map((period: DashaPeriod) => (
          <Info
            key={`${period.planet}-${period.startDate}`}
            label={period.planet}
            value={`${period.startDate} → ${period.endDate}`}
          />
        ))}
      </div>
    </article>
  );
}

function DoshaCard({ dosha }: { dosha: KundaliDoshaResponse }) {
  return (
    <article className="result-card">
      <h2>Dosha</h2>

      <Info
        label="Mangal Dosha"
        value={dosha.mangalDoshaPresent ? "Present" : "Not Present"}
      />
      <Info label="Type" value={dosha.type} />
      <Info label="Intensity" value={dosha.intensity} />

      <p>{dosha.reason}</p>
      <p>{dosha.info}</p>
    </article>
  );
}

function PdfDownloadCard({ summary }: { summary: KundaliSummaryResponse }) {
  return (
    <article className="result-card">
      <p className="eyebrow">PDF Report</p>
      <h2>Download Kundali PDF Report</h2>
      <p>PDF download is available only when admin approves PDF access.</p>

      <button type="button" onClick={() => downloadKundaliPdf(summary.id)}>
        Download PDF
      </button>
    </article>
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
    <div className="info-box">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

export default KundaliPage;