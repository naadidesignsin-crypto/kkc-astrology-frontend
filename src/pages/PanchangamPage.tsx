import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import kkcLogo from "../assets/Logo.png";
import BlackWhiteCosmicBackground from "../components/BlackWhiteCosmicBackground";
import { getDailyPanchang } from "../services/panchangApi";
import type { DailyPanchangResponse } from "../types/panchang";
import { openWhatsAppShare } from "../utils/whatsappShare";

const panchangPlaces = [
  { label: "Hyderabad, Telangana", value: "hyderabad" },
  { label: "Warangal, Telangana", value: "warangal" },
  { label: "Vijayawada, Andhra Pradesh", value: "vijayawada" },
  { label: "Tirupati, Andhra Pradesh", value: "tirupati" },
  { label: "Visakhapatnam, Andhra Pradesh", value: "visakhapatnam" },
  { label: "Guntur, Andhra Pradesh", value: "guntur" },
  { label: "Rajahmundry, Andhra Pradesh", value: "rajahmundry" },
  { label: "Nellore, Andhra Pradesh", value: "nellore" },
];

function getTodayLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return {
      day: "--",
      month: "--",
      year: "----",
      weekday: "----",
      full: dateValue,
    };
  }

  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleString("en-IN", { month: "short" }),
    year: String(date.getFullYear()),
    weekday: date.toLocaleString("en-IN", { weekday: "long" }),
    full: date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };
}

function buildShareText(panchang: DailyPanchangResponse) {
  return [
    "KKC Daily Panchangam",
    "",
    `Date: ${panchang.date}`,
    `Place: ${panchang.place}`,
    "",
    `Varam: ${panchang.varam || "-"}`,
    `Tithi: ${panchang.tithi || "-"}`,
    `Nakshatram: ${panchang.nakshatram || "-"}`,
    `Yogam: ${panchang.yogam || "-"}`,
    `Karanam: ${panchang.karanam || "-"}`,
    `Paksham: ${panchang.paksham || "-"}`,
    `Masam: ${panchang.masam || "-"}`,
    `Samvatsaram: ${panchang.samvatsaram || "-"}`,
    `Ayanam: ${panchang.ayanam || "-"}`,
    `Ritu: ${panchang.ritu || "-"}`,
    "",
    `Sunrise: ${panchang.sunrise || "-"}`,
    `Sunset: ${panchang.sunset || "-"}`,
    `Moonrise: ${panchang.moonrise || "-"}`,
    `Moonset: ${panchang.moonset || "-"}`,
    "",
    `Rahu Kalam: ${panchang.rahuKalam || "-"}`,
    `Yamagandam: ${panchang.yamagandam || "-"}`,
    `Gulika Kalam: ${panchang.gulikaKalam || "-"}`,
    `Durmuhurtham: ${panchang.durmuhurtham || "-"}`,
    `Varjyam: ${panchang.varjyam || "-"}`,
    `Amrita Kalam: ${panchang.amritaKalam || "-"}`,
    `Abhijit Muhurtham: ${panchang.abhijitMuhurtham || "-"}`,
    "",
    "- Kundalini Kriya Chaitanyam",
  ].join("\n");
}

function PanchangamPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayLocalDate());
  const [selectedPlace, setSelectedPlace] = useState("hyderabad");
  const [panchang, setPanchang] = useState<DailyPanchangResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [error, setError] = useState("");

  const calendar = useMemo(() => formatDate(selectedDate), [selectedDate]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadPanchangam() {
      try {
        setLoading(true);
        setError("");
        setCopyStatus("");

        const response = await getDailyPanchang(
          selectedDate,
          selectedPlace,
          controller.signal
        );

        if (!cancelled) {
          setPanchang(response);
        }
      } catch (err) {
        if (!cancelled) {
          setPanchang(null);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load Panchangam. Try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPanchangam();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [selectedDate, selectedPlace]);

  async function copyPanchangam() {
    if (!panchang) {
      return;
    }

    try {
      await navigator.clipboard.writeText(buildShareText(panchang));
      setCopyStatus("Panchangam copied.");
    } catch {
      setCopyStatus("Copy failed. Please select and copy manually.");
    }
  }

  function sharePanchangamOnWhatsApp() {
    if (!panchang) {
      return;
    }

    openWhatsAppShare(buildShareText(panchang));
  }

  return (
    <main className="kkc-panchangam-page">
      <BlackWhiteCosmicBackground />

      <header className="kkc-header kkc-panchangam-header">
        <Link to="/" className="kkc-brand" aria-label="KKC Home">
          <img src={kkcLogo} alt="KKC Logo" />

          <span>
            <strong>KKC</strong>
            <small>Kundalini Kriya Chaitanyam</small>
          </span>
        </Link>

        <nav className="kkc-nav" aria-label="Panchangam navigation">
          <Link to="/">Home</Link>
          <a href="#panchang-main">Panchangam</a>
          <a href="#panchang-timings">Timings</a>
          <Link to="/rasi-phalalu">Rasi Phalalu</Link>
          <Link to="/kundali">Kundali</Link>
        </nav>

        <Link className="kkc-outline-btn" to="/kundali">
          Generate Order ID
        </Link>
      </header>

      <section className="kkc-panchangam-hero">
        <div className="kkc-panchangam-calendar">
          <span>{calendar.month}</span>
          <strong>{calendar.day}</strong>
          <small>{calendar.year}</small>
        </div>

        <div className="kkc-panchangam-copy">
          <p className="kkc-eyebrow">Full Daily Panchangam</p>

          <h1>South Andhra & Telangana Style Panchangam</h1>

          <p>
            View complete daily Panchangam details for selected date and place,
            including Tithi, Nakshatram, Yogam, Karanam, Rahu Kalam,
            Yamagandam, Gulika Kalam, Varjyam and important daily timings.
          </p>

          <div className="kkc-panchangam-meta-row">
            <span>{calendar.weekday}</span>
            <span>{calendar.full}</span>
            <span>{panchang?.place || "Hyderabad, Telangana"}</span>
            <span>Telugu / English Format</span>
          </div>
        </div>
      </section>

      <section className="kkc-panchangam-controls-card">
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
            {panchangPlaces.map((place) => (
              <option key={place.value} value={place.value}>
                {place.label}
              </option>
            ))}
          </select>
        </label>

        <div className="kkc-panchangam-actions">
          <button type="button" onClick={copyPanchangam} disabled={!panchang}>
            Copy Panchangam
          </button>

          <button
            type="button"
            onClick={sharePanchangamOnWhatsApp}
            disabled={!panchang}
          >
            Share on WhatsApp
          </button>
        </div>
      </section>

      {copyStatus && <p className="kkc-panchangam-copy-status">{copyStatus}</p>}

      {loading && (
        <section className="kkc-panchangam-state">
          Loading full Panchangam...
        </section>
      )}

      {error && !loading && (
        <section className="kkc-panchangam-state error">{error}</section>
      )}

      {panchang && !loading && !error && (
        <>
          <section className="kkc-panchangam-grid" id="panchang-main">
            <PanchangSection
              title="Main Panchangam"
              subtitle="Telugu Panchangam core details"
              items={[
                ["వారము / Varam", panchang.varam],
                ["తిథి / Tithi", panchang.tithi],
                ["నక్షత్రం / Nakshatram", panchang.nakshatram],
                ["యోగం / Yogam", panchang.yogam],
                ["కరణం / Karanam", panchang.karanam],
                ["పక్షం / Paksham", panchang.paksham],
                ["మాసం / Masam", panchang.masam],
                ["సంవత్సరం / Samvatsaram", panchang.samvatsaram],
                ["ఆయనం / Ayanam", panchang.ayanam],
                ["ఋతువు / Ritu", panchang.ritu],
              ]}
            />

            <PanchangSection
              title="Sun & Moon"
              subtitle="Daily sunrise, sunset and lunar timings"
              items={[
                ["Sunrise", panchang.sunrise],
                ["Sunset", panchang.sunset],
                ["Moonrise", panchang.moonrise],
                ["Moonset", panchang.moonset],
              ]}
            />
          </section>

          <section className="kkc-panchangam-grid" id="panchang-timings">
            <PanchangSection
              title="Inauspicious Timings"
              subtitle="Avoid these periods for important new work"
              items={[
                ["Rahu Kalam", panchang.rahuKalam],
                ["Yamagandam", panchang.yamagandam],
                ["Gulika Kalam", panchang.gulikaKalam],
                ["Durmuhurtham", panchang.durmuhurtham],
                ["Varjyam", panchang.varjyam],
              ]}
            />

            <PanchangSection
              title="Auspicious Timings"
              subtitle="Useful time windows for daily planning"
              items={[
                ["Amrita Kalam", panchang.amritaKalam],
                ["Abhijit Muhurtham", panchang.abhijitMuhurtham],
              ]}
            />
          </section>

          <section className="kkc-panchangam-note-card">
            <p className="kkc-eyebrow">Daily Use</p>

            <h2>Use Panchangam for daily spiritual timing</h2>

            <p>
              This Panchangam is intended for daily timing reference. For
              personal Muhurtham, marriage, Gruhapravesam, naming ceremony or
              detailed astrology guidance, generate a Kundali Order ID and
              consult KKC.
            </p>

            <Link className="kkc-white-btn" to="/kundali">
              Generate Kundali Order ID
            </Link>
          </section>
        </>
      )}
    </main>
  );
}

function PanchangSection({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: [string, string | null | undefined][];
}) {
  return (
    <article className="kkc-panchangam-section-card">
      <div className="kkc-panchangam-section-head">
        <div>
          <p className="kkc-eyebrow">{subtitle}</p>
          <h2>{title}</h2>
        </div>
      </div>

      <div className="kkc-panchangam-table">
        {items.map(([label, value]) => (
          <div className="kkc-panchangam-row" key={label}>
            <span>{label}</span>
            <strong>{value || "-"}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

export default PanchangamPage;