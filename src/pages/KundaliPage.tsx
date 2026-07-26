import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import kkcLogo from "../assets/Logo.png";
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
  KundaliHouseResponse,
  KundaliNavamsaResponse,
  KundaliParasharaReportResponse,
  KundaliPlanetsResponse,
  KundaliSummaryResponse,
} from "../types/kundali";

import BlackWhiteCosmicBackground from "../components/BlackWhiteCosmicBackground";
import PlanetBadge from "../components/PlanetBadge";
import SouthIndianBirthChart from "../components/SouthIndianBirthChart";

type KundaliForm = {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  timeOfBirth: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  language: string;
};

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
      setStage("Creating Kundali");
      setError("");

      setSummary(null);
      setPlanets(null);
      setDasha(null);
      setDosha(null);
      setHouses(null);
      setNavamsa(null);
      setParashara(null);
      setActiveReportTab("summary");

      const payload = {
        ...form,
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

      setStage("Reading planetary positions");
      await generateSection(reportId, "PLANETARY_POSITIONS");

      setStage("Reading Dasha details");
      await generateSection(reportId, "DASHA");

      setStage("Reading Dosha details");
      await generateSection(reportId, "DOSHA");

      setStage("Preparing report tabs");

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
      setActiveReportTab("summary");
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
            Enter birth details to generate Lagna, Rashi, Nakshatra, planetary
            positions, Vimshottari Dasha, Mangal Dosha, Navamsa, Parāśara
            interpretation, house analysis, and PDF report.
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

          <div className="kkc-kundali-form-row">
            <label>
              Date of Birth
              <input
                type="date"
                value={form.dateOfBirth}
                onClick={(event) => openNativePicker(event.currentTarget)}
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
                onClick={(event) => openNativePicker(event.currentTarget)}
                onChange={(event) =>
                  updateField("timeOfBirth", event.target.value)
                }
                required
              />
            </label>
          </div>

          <div className="kkc-location-box" ref={locationBoxRef}>
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
              Complete all required fields and select birth place from the list.
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
              After generation, report tabs will show summary, birth chart,
              Navamsa, Parāśara, houses, planets, Dasha, Dosha, PDF and
              consultation.
            </p>
          </div>
        )}

        {loading && (
          <div className="kkc-empty-report">
            <p className="kkc-eyebrow">Processing</p>
            <h2>{stage || "Generating Kundali"}</h2>
            <p>Please wait while the astrology report is prepared.</p>
          </div>
        )}

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
  const tabs: { id: ReportTabId; label: string; disabled?: boolean }[] = [
    { id: "summary", label: "Summary" },
    { id: "birth-chart", label: "Birth Chart", disabled: !planets },
    { id: "navamsa", label: "Navamsa", disabled: !navamsa },
    { id: "parashara", label: "Parāśara", disabled: !parashara },
    { id: "houses", label: "Houses", disabled: !houses },
    { id: "planets", label: "Planets", disabled: !planets },
    { id: "dasha", label: "Dasha", disabled: !dasha },
    { id: "dosha", label: "Dosha", disabled: !dosha },
    { id: "pdf", label: "PDF" },
    { id: "consultation", label: "Consultation" },
  ];

  const consultationMessage = encodeURIComponent(
    `Namaste KKC, I want consultation for Kundali report ID ${summary.id}. Name: ${summary.fullName}`
  );

  const consultationUrl = `https://wa.me/${whatsappNumber}?text=${consultationMessage}`;

  return (
    <div className="kkc-report-experience">
      <section className="kkc-report-hero-card">
        <div className="kkc-report-hero-content">
          <p className="kkc-report-label">Generated Kundali Report</p>

          <h2>{summary.fullName}</h2>

          <p className="kkc-report-subtitle">
            {summary.birthPlace} • {summary.dateOfBirth} •{" "}
            {summary.timeOfBirth}
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
              <dd>{parashara?.currentDasha || dasha?.currentDasha?.planet || "-"}</dd>
            </div>
          </dl>
        </div>

        <div className="kkc-report-hero-actions">
          <button type="button" onClick={() => downloadKundaliPdf(summary.id)}>
            Download PDF
          </button>

          <a href={consultationUrl} target="_blank" rel="noreferrer">
            Consult on WhatsApp
          </a>
        </div>
      </section>

      <section className="kkc-report-navigation">
        <div className="kkc-report-navigation-copy">
          <span>Explore Report</span>
          <p>
            Move through each section without scrolling through a long report.
          </p>
        </div>

        <div className="kkc-tabs" role="tablist" aria-label="Kundali report tabs">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              className={activeTab === tab.id ? "kkc-tab active" : "kkc-tab"}
              disabled={tab.disabled}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <div className="kkc-tab-panel">
        {activeTab === "summary" && <SummaryTab summary={summary} />}

        {activeTab === "birth-chart" && planets && (
          <BirthChartTab planets={planets} />
        )}

        {activeTab === "navamsa" && navamsa && (
          <NavamsaTab navamsa={navamsa} />
        )}

        {activeTab === "parashara" && parashara && (
          <ParasharaTab parashara={parashara} />
        )}

        {activeTab === "houses" && houses && <HousesTab houses={houses} />}

        {activeTab === "planets" && planets && (
          <PlanetsTab planets={planets} />
        )}

        {activeTab === "dasha" && dasha && <DashaTab dasha={dasha} />}

        {activeTab === "dosha" && dosha && <DoshaTab dosha={dosha} />}

        {activeTab === "pdf" && <PdfTab summary={summary} />}

        {activeTab === "consultation" && (
          <ConsultationTab summary={summary} />
        )}
      </div>
    </div>
  );
}

function SummaryTab({ summary }: { summary: KundaliSummaryResponse }) {
  return (
    <>
      <div className="kkc-report-grid">
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
    </>
  );
}

function BirthChartTab({ planets }: { planets: KundaliPlanetsResponse }) {
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
    </article>
  );
}

function NavamsaTab({ navamsa }: { navamsa: KundaliNavamsaResponse }) {
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
    </article>
  );
}

function ParasharaTab({
  parashara,
}: {
  parashara: KundaliParasharaReportResponse;
}) {
  return (
    <article className="kkc-report-section">
      <h3>Parāśara Interpretation</h3>

      <div className="kkc-report-grid">
        <Info label="Lagna" value={parashara.lagna} />
        <Info label="Rashi" value={parashara.rashi} />
        <Info label="Nakshatra" value={parashara.nakshatra} />
        <Info label="Current Dasha" value={parashara.currentDasha} />
        <Info label="Navamsa Ascendant" value={parashara.navamsaAscendant} />
      </div>

      <div className="kkc-parashara-grid">
        {parashara.sections.map((section) => (
          <div className="kkc-parashara-card" key={section.sectionKey}>
            <h4>{section.title}</h4>
            <p>{section.summary}</p>

            {section.focusAreas.length > 0 && (
              <div className="kkc-tags">
                {section.focusAreas.map((item) => (
                  <small key={item}>{item}</small>
                ))}
              </div>
            )}

            {section.observations.length > 0 && (
              <ul>
                {section.observations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            <strong>Guidance</strong>
            <p>{section.guidance}</p>

            {section.caution && (
              <>
                <strong>Caution</strong>
                <p>{section.caution}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}

function HousesTab({ houses }: { houses: KundaliHouseResponse }) {
  return (
    <article className="kkc-report-section">
      <h3>House-wise Interpretation</h3>

      <div className="kkc-house-interpretation-grid">
        {houses.houses.map((house) => (
          <div className="kkc-house-reading-card" key={house.houseNumber}>
            <span>House {house.houseNumber}</span>
            <h4>{house.houseName}</h4>
            <strong>{house.mainArea}</strong>
            <p>{house.meaning}</p>
            <p>{house.interpretation}</p>

            {house.planets.length > 0 && (
              <div className="kkc-tags">
                {house.planets.map((planet) => (
                  <small key={`${house.houseNumber}-${planet.name}`}>
                    {planet.name}
                  </small>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}

function PlanetsTab({ planets }: { planets: KundaliPlanetsResponse }) {
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
          <div className="planet-detail-card" key={`${planet.name}-${planet.house}`}>
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
    </article>
  );
}

function DashaTab({ dasha }: { dasha: KundaliDashaResponse }) {
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
        {dasha.dashaPeriods.map((period: DashaPeriod) => (
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
    </article>
  );
}

function DoshaTab({ dosha }: { dosha: KundaliDoshaResponse }) {
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
    </article>
  );
}

function PdfTab({ summary }: { summary: KundaliSummaryResponse }) {
  return (
    <article className="kkc-report-section kkc-pdf-tab">
      <p className="kkc-eyebrow">PDF Report</p>
      <h3>Download complete Kundali report</h3>
      <p>
        Download Kundali summary, planetary positions, houses, Navamsa, Dasha
        and Dosha details in PDF format.
      </p>

      <button type="button" onClick={() => downloadKundaliPdf(summary.id)}>
        Download PDF
      </button>
    </article>
  );
}

function ConsultationTab({ summary }: { summary: KundaliSummaryResponse }) {
  const message = encodeURIComponent(
    `Namaste KKC, I want consultation for Kundali report ID ${summary.id}. Name: ${summary.fullName}`
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

      <a className="kkc-primary-btn" href={consultationUrl} target="_blank" rel="noreferrer">
        Consult on WhatsApp
      </a>
    </article>
  );
}

export default KundaliPage;