import { useEffect, useMemo, useState } from "react";

import { getDailyPanchang } from "../services/panchangApi";
import type { DailyPanchangResponse } from "../types/panchang";

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

function formatCalendarDate(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return {
      month: "--",
      day: "--",
      year: "----",
      weekday: "----",
    };
  }

  return {
    month: date.toLocaleString("en-IN", { month: "short" }),
    day: String(date.getDate()).padStart(2, "0"),
    year: String(date.getFullYear()),
    weekday: date.toLocaleString("en-IN", { weekday: "long" }),
  };
}

function DailyPanchangCard() {
  const [selectedDate, setSelectedDate] = useState(getTodayLocalDate());
  const [selectedPlace, setSelectedPlace] = useState("hyderabad");
  const [panchang, setPanchang] = useState<DailyPanchangResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calendar = useMemo(
    () => formatCalendarDate(selectedDate),
    [selectedDate]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadDailyPanchang() {
      try {
        setLoading(true);
        setError("");

        const response = await getDailyPanchang(selectedDate, selectedPlace);

        if (!cancelled) {
          setPanchang(response);
        }
      } catch (err) {
        if (!cancelled) {
          setPanchang(null);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load daily Panchangam."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDailyPanchang();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, selectedPlace]);

  return (
    <section className="kkc-daily-panchang-v2" id="daily-panchang">
      <div className="kkc-daily-panchang-v2-card">
        <div className="kkc-panchang-v2-left">
          <div className="kkc-panchang-v2-calendar">
            <span>{calendar.month}</span>
            <strong>{calendar.day}</strong>
            <small>{calendar.year}</small>
          </div>

          <div>
            <p className="kkc-eyebrow">Daily Panchangam</p>

            <h2>Today’s Telugu Panchangam</h2>

            <p>
              South Andhra and Telangana style daily Panchangam for spiritual
              timing, Rahu Kalam, Yamagandam, Gulika Kalam and important daily
              details.
            </p>
          </div>
        </div>

        <div className="kkc-panchang-v2-controls">
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
        </div>

        <div className="kkc-panchang-v2-meta">
          <span>{calendar.weekday}</span>
          <span>{panchang?.place || "Hyderabad, Telangana"}</span>
          <span>AP & Telangana Style</span>
        </div>

        {loading && (
          <div className="kkc-panchang-v2-state">
            Loading daily Panchangam...
          </div>
        )}

        {error && !loading && (
          <div className="kkc-panchang-v2-state error">{error}</div>
        )}

        {panchang && !loading && !error && (
          <div className="kkc-panchang-v2-grid">
            <PanchangMiniCard
              title="Panchangam"
              items={[
                ["వారము / Varam", panchang.varam],
                ["తిథి / Tithi", panchang.tithi],
                ["నక్షత్రం / Nakshatram", panchang.nakshatram],
                ["యోగం / Yogam", panchang.yogam],
                ["కరణం / Karanam", panchang.karanam],
              ]}
            />

            <PanchangMiniCard
              title="Sun & Moon"
              items={[
                ["Sunrise", panchang.sunrise],
                ["Sunset", panchang.sunset],
                ["Moonrise", panchang.moonrise],
                ["Moonset", panchang.moonset],
              ]}
            />

            <PanchangMiniCard
              title="Important Timings"
              items={[
                ["Rahu Kalam", panchang.rahuKalam],
                ["Yamagandam", panchang.yamagandam],
                ["Gulika Kalam", panchang.gulikaKalam],
                ["Durmuhurtham", panchang.durmuhurtham],
                ["Varjyam", panchang.varjyam],
              ]}
            />

            <PanchangMiniCard
              title="Auspicious Time"
              items={[
                ["Amrita Kalam", panchang.amritaKalam],
                ["Abhijit Muhurtham", panchang.abhijitMuhurtham],
                ["Paksham", panchang.paksham],
                ["Masam", panchang.masam],
                ["Samvatsaram", panchang.samvatsaram],
              ]}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function PanchangMiniCard({
  title,
  items,
}: {
  title: string;
  items: [string, string | null | undefined][];
}) {
  return (
    <article className="kkc-panchang-v2-mini-card">
      <h3>{title}</h3>

      <div>
        {items.map(([label, value]) => (
          <div className="kkc-panchang-v2-row" key={label}>
            <span>{label}</span>
            <strong>{value || "-"}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

export default DailyPanchangCard;