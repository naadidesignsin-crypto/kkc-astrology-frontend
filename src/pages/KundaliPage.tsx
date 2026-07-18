import { useState } from "react";
import type { FormEvent } from "react";

import AstrologyServices from "../components/AstrologyServices";
import { locationPresets } from "../data/locationPresets";
import { uiText } from "../data/kundaliUiText";

import {
  generateKundali,
  generateSection,
  getDasha,
  getDosha,
  getPlanets,
  getSummary,
} from "../services/kundaliApi";

import type { UiLanguage } from "../types/language";

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

type DisplayValueFn = (value?: string | number | boolean | null) => string;
type TextMap = typeof uiText["te"];

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

  const [language, setLanguage] = useState<UiLanguage>("te");

  const t = uiText[language];
  const useTeluguValues = language === "te";

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
        throw new Error(generated.errorMessage || t.generationFailed);
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
            <strong>{t.brandTitle}</strong>
            <small>{t.brandSubtitle}</small>
          </span>
        </a>

        <nav className="top-nav" aria-label="Main navigation">
          <a href="#services">{t.navServices}</a>
          <a href="#kundali-form">{t.navKundali}</a>
          <a href="#summary">{t.navSummary}</a>
          <a href="#planets">{t.navPlanets}</a>
          <a href="#dasha">{t.navDasha}</a>
          <a href="#dosha">{t.navDosha}</a>
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

      <AstrologyServices />

      <section className="content-grid">
        <form className="kundali-form" id="kundali-form" onSubmit={handleSubmit}>
          <h2>{t.formTitle}</h2>

          <label>
            {t.fullName}
            <input
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              required
            />
          </label>

          <label>
            {t.gender}
            <select
              value={form.gender}
              onChange={(event) => updateField("gender", event.target.value)}
            >
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
              required
            />
          </label>

          <label>
            {t.city}
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
            {t.birthPlace}
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
              {t.latitude}
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
              {t.longitude}
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
            {t.timezone}
            <input
              value={form.timezone}
              onChange={(event) => updateField("timezone", event.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? t.generating : t.generate}
          </button>

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
            <div className="empty-card">
              <h2>{t.loadingTitle}</h2>
              <p>{t.loadingDescription}</p>
            </div>
          )}

          {summary && (
            <>
              <SummaryCard
                summary={summary}
                t={t}
                displayValue={displayValue}
              />

              {planets && (
                <PlanetTable
                  planets={planets}
                  t={t}
                  displayValue={displayValue}
                />
              )}

              {dasha && (
                <DashaCard
                  dasha={dasha}
                  t={t}
                  displayValue={displayValue}
                />
              )}

              {dosha && (
                <DoshaCard
                  dosha={dosha}
                  t={t}
                  displayValue={displayValue}
                  displaySentence={displaySentence}
                />
              )}
            </>
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