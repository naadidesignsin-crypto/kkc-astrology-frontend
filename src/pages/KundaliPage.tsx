import { useState } from "react";
import type { FormEvent } from "react";

import {
  generateKundali,
  generateSection,
  getDasha,
  getDosha,
  getPlanets,
  getSummary,
} from "../services/kundaliApi";

import { locationPresets } from "../data/locationPresets";

import type {
  DashaPeriod,
  KundaliDashaResponse,
  KundaliDoshaResponse,
  KundaliPlanetsResponse,
  KundaliSummaryResponse,
} from "../types/kundali";

import {
  toTeluguValue,
  translateKundaliSentence,
} from "../utils/kundaliTranslations";

import AstrologyServices from "../components/AstrologyServices";

const defaultForm = {
  fullName: "Test User",
  gender: "Male",
  dateOfBirth: "1995-08-15",
  timeOfBirth: "06:30:00",
  birthPlace: "Hyderabad, Telangana, India",
  latitude: 17.385,
  longitude: 78.4867,
  timezone: "Asia/Kolkata",
  language: "en",
};

function KundaliPage() {
  const [form, setForm] = useState(defaultForm);
  const [selectedCity, setSelectedCity] = useState("హైదరాబాద్");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState<KundaliSummaryResponse | null>(null);
  const [planets, setPlanets] = useState<KundaliPlanetsResponse | null>(null);
  const [dasha, setDasha] = useState<KundaliDashaResponse | null>(null);
  const [dosha, setDosha] = useState<KundaliDoshaResponse | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSummary(null);
    setPlanets(null);
    setDasha(null);
    setDosha(null);

    try {
      const generated = await generateKundali(form);

      if (generated.status !== "SUCCESS") {
        throw new Error(
          generated.errorMessage || "జాతకం రూపొందించడంలో సమస్య వచ్చింది."
        );
      }

      const reportId = generated.id;

      await generateSection(reportId, "PLANETARY_POSITIONS");
      await generateSection(reportId, "DASHA");
      await generateSection(reportId, "DOSHA");

      const [summaryData, planetData, dashaData, doshaData] = await Promise.all([
        getSummary(reportId),
        getPlanets(reportId),
        getDasha(reportId),
        getDosha(reportId),
      ]);

      setSummary(summaryData);
      setPlanets(planetData);
      setDasha(dashaData);
      setDosha(doshaData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ఏదో సమస్య వచ్చింది.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(name: string, value: string) {
    setForm((current) => ({
      ...current,
      [name]:
        name === "latitude" || name === "longitude" ? Number(value) : value,
    }));
  }

  function handleCityChange(cityLabel: string) {
    setSelectedCity(cityLabel);

    const city = locationPresets.find((item) => item.label === cityLabel);

    if (!city) {
      return;
    }

    setForm((current) => ({
      ...current,
      birthPlace: city.birthPlace,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: city.timezone,
    }));
  }

  return (
    <main className="kundali-page">
      <header className="site-header">
        <a href="#top" className="brand-block" aria-label="KKC Astrology Home">
          <span className="brand-mark">ॐ</span>
          <span>
            <strong>KKC Astrology</strong>
            <small>జాతకం • జ్యోతిష్యం • మార్గదర్శనం</small>
          </span>
        </a>

        <nav className="top-nav" aria-label="Main navigation">
          <a href="#services">సేవలు</a>
          <a href="#kundali-form">జాతకం</a>
          <a href="#summary">సారాంశం</a>
          <a href="#planets">గ్రహాలు</a>
          <a href="#dasha">దశ</a>
          <a href="#dosha">దోషం</a>
        </nav>
      </header>

      <section className="hero-section" id="top">
        <div>
          <p className="eyebrow">KKC జ్యోతిష్యం</p>
          <h1>జాతక చక్రం తయారీ</h1>
          <p>
            జనన తేదీ, సమయం, జన్మ స్థలం ఆధారంగా లగ్నం, రాశి, నక్షత్రం,
            గ్రహ స్థానాలు, విమ్షోత్తరి మహాదశ మరియు మంగళ దోష విశ్లేషణను చూడండి.
          </p>
        </div>

        <div className="hero-note">
          <strong>.in Astrology Portal</strong>
          <span>
            ఈ పేజీ జ్యోతిష్యం మరియు జాతక సేవల కోసం మాత్రమే. Events, Donation,
            Video Gallery విషయాలు .com సైట్‌లో ఉంటాయి.
          </span>
        </div>
      </section>

      <AstrologyServices />

      <section className="content-grid">
        <form className="kundali-form" id="kundali-form" onSubmit={handleSubmit}>
          <h2>జనన వివరాలు</h2>

          <label>
            పూర్తి పేరు
            <input
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              required
            />
          </label>

          <label>
            లింగం
            <select
              value={form.gender}
              onChange={(event) => updateField("gender", event.target.value)}
            >
              <option value="Male">పురుషుడు</option>
              <option value="Female">స్త్రీ</option>
            </select>
          </label>

          <label>
            జనన తేదీ
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
            జనన సమయం
            <input
              type="time"
              step="1"
              value={form.timeOfBirth}
              onChange={(event) =>
                updateField("timeOfBirth", event.target.value)
              }
              required
            />
          </label>

          <label>
            నగరం ఎంపిక చేయండి
            <select
              value={selectedCity}
              onChange={(event) => handleCityChange(event.target.value)}
            >
              {locationPresets.map((city) => (
                <option value={city.label} key={city.label}>
                  {city.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            జన్మ స్థలం
            <input
              value={form.birthPlace}
              onChange={(event) =>
                updateField("birthPlace", event.target.value)
              }
              required
            />
          </label>

          <div className="two-column">
            <label>
              అక్షాంశం
              <input
                type="number"
                step="0.000001"
                value={form.latitude}
                onChange={(event) =>
                  updateField("latitude", event.target.value)
                }
                required
              />
            </label>

            <label>
              రేఖాంశం
              <input
                type="number"
                step="0.000001"
                value={form.longitude}
                onChange={(event) =>
                  updateField("longitude", event.target.value)
                }
                required
              />
            </label>
          </div>

          <label>
            టైమ్‌జోన్
            <input
              value={form.timezone}
              onChange={(event) => updateField("timezone", event.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "జాతకం రూపొందుతోంది..." : "జాతకం రూపొందించండి"}
          </button>

          {error && <p className="error-message">{error}</p>}
        </form>

        <section className="result-panel">
          {!summary && !loading && (
            <div className="empty-card">
              <h2>జాతక వివరాలు ఇక్కడ కనిపిస్తాయి</h2>
              <p>
                జనన వివరాలు నమోదు చేసి జాతక సారాంశం, గ్రహ స్థానాలు, దశ మరియు
                దోష వివరాలు చూడండి.
              </p>
            </div>
          )}

          {loading && (
            <div className="empty-card">
              <h2>జాతకం రూపొందుతోంది...</h2>
              <p>
                అన్ని జాతక విభాగాలు సిద్ధం చేస్తున్నాం. దయచేసి వేచి ఉండండి.
              </p>
            </div>
          )}

          {summary && (
            <>
              <SummaryCard summary={summary} />
              {planets && <PlanetTable planets={planets} />}
              {dasha && <DashaCard dasha={dasha} />}
              {dosha && <DoshaCard dosha={dosha} />}
            </>
          )}
        </section>
      </section>
    </main>
  );
}

function SummaryCard({ summary }: { summary: KundaliSummaryResponse }) {
  return (
    <div className="result-card" id="summary">
      <h2>జాతక సారాంశం</h2>

      <div className="detail-grid">
        <Info label="పేరు" value={summary.fullName} />
        <Info label="జన్మ స్థలం" value={summary.birthPlace} />
        <Info label="లగ్నం" value={toTeluguValue(summary.ascendant)} />
        <Info label="రాశి" value={toTeluguValue(summary.rashi)} />
        <Info label="నక్షత్రం" value={toTeluguValue(summary.nakshatra)} />
        <Info label="పాదం" value={summary.charan} />
        <Info label="రాశి అధిపతి" value={toTeluguValue(summary.signLord)} />
        <Info
          label="నక్షత్ర అధిపతి"
          value={toTeluguValue(summary.nakshatraLord)}
        />
        <Info label="తిథి" value={toTeluguValue(summary.tithi)} />
        <Info label="యోగం" value={toTeluguValue(summary.yoga)} />
        <Info label="కరణం" value={toTeluguValue(summary.karan)} />
        <Info label="మాసం" value={toTeluguValue(summary.masa)} />
        <Info label="సూర్యోదయం" value={summary.sunrise} />
        <Info label="సూర్యాస్తమయం" value={summary.sunset} />
      </div>
    </div>
  );
}

function PlanetTable({ planets }: { planets: KundaliPlanetsResponse }) {
  return (
    <div className="result-card" id="planets">
      <h2>గ్రహ స్థానాలు</h2>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>గ్రహం</th>
              <th>డిగ్రీ</th>
              <th>రాశి</th>
              <th>నక్షత్రం</th>
              <th>భవం</th>
              <th>వక్రం</th>
              <th>అస్తం</th>
              <th>స్థితి</th>
            </tr>
          </thead>

          <tbody>
            {planets.planets.map((planet) => (
              <tr key={`${planet.name}-${planet.longitude}`}>
                <td>{toTeluguValue(planet.name)}</td>
                <td>{planet.degree}</td>
                <td>{toTeluguValue(planet.rashi)}</td>
                <td>{toTeluguValue(planet.nakshatra)}</td>
                <td>{planet.house}</td>
                <td>{planet.retrograde ? "అవును" : "కాదు"}</td>
                <td>{planet.combust ? "అవును" : "కాదు"}</td>
                <td>{toTeluguValue(planet.planetState)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DashaCard({ dasha }: { dasha: KundaliDashaResponse }) {
  return (
    <div className="result-card" id="dasha">
      <h2>విమ్షోత్తరి మహాదశ</h2>

      {dasha.currentDasha && (
        <div className="highlight-box">
          <strong>
            ప్రస్తుత దశ: {toTeluguValue(dasha.currentDasha.planet)}
          </strong>
          <span>
            {dasha.currentDasha.startDate} నుంచి {dasha.currentDasha.endDate} వరకు
          </span>
        </div>
      )}

      <div className="dasha-list">
        {dasha.dashaPeriods.map((period: DashaPeriod) => (
          <div
            className={period.active ? "dasha-item active" : "dasha-item"}
            key={`${period.planet}-${period.startDate}`}
          >
            <strong>{toTeluguValue(period.planet)}</strong>
            <span>
              {period.startDate} → {period.endDate}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoshaCard({ dosha }: { dosha: KundaliDoshaResponse }) {
  return (
    <div className="result-card" id="dosha">
      <h2>మంగళ దోష విశ్లేషణ</h2>

      <div className="detail-grid">
        <Info
          label="మంగళ దోషం"
          value={dosha.mangalDoshaPresent ? "ఉంది" : "లేదు"}
        />
        <Info label="రకం" value={toTeluguValue(dosha.type)} />
        <Info label="తీవ్రత" value={toTeluguValue(dosha.intensity)} />
      </div>

      <p className="description-text">
        {translateKundaliSentence(dosha.reason)}
      </p>
      <p className="description-text muted">
        {translateKundaliSentence(dosha.info)}
      </p>
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