import { useState } from "react";

import PlanetBadge from "./PlanetBadge";
import type { HouseInterpretationResponse } from "../types/kundali";

type HouseReadingCardProps = {
  house: HouseInterpretationResponse;
  defaultOpen?: boolean;
};

const HOUSE_META: Record<
  number,
  {
    title: string;
    shortArea: string;
    group: string;
    groupClass: string;
  }
> = {
  1: {
    title: "Self & Personality",
    shortArea: "Body, identity, confidence",
    group: "Kendra",
    groupClass: "kendra",
  },
  2: {
    title: "Wealth & Speech",
    shortArea: "Family, food, savings",
    group: "Artha",
    groupClass: "artha",
  },
  3: {
    title: "Courage & Effort",
    shortArea: "Siblings, communication, skills",
    group: "Upachaya",
    groupClass: "upachaya",
  },
  4: {
    title: "Home & Comfort",
    shortArea: "Mother, property, peace",
    group: "Kendra",
    groupClass: "kendra",
  },
  5: {
    title: "Education & Intelligence",
    shortArea: "Children, creativity, learning",
    group: "Trikona",
    groupClass: "trikona",
  },
  6: {
    title: "Health & Service",
    shortArea: "Enemies, disease, discipline",
    group: "Dusthana",
    groupClass: "dusthana",
  },
  7: {
    title: "Marriage & Partnership",
    shortArea: "Spouse, business, contracts",
    group: "Kendra",
    groupClass: "kendra",
  },
  8: {
    title: "Transformation",
    shortArea: "Longevity, secrets, sudden events",
    group: "Dusthana",
    groupClass: "dusthana",
  },
  9: {
    title: "Dharma & Fortune",
    shortArea: "Father, luck, higher wisdom",
    group: "Trikona",
    groupClass: "trikona",
  },
  10: {
    title: "Career & Karma",
    shortArea: "Profession, status, public work",
    group: "Kendra",
    groupClass: "kendra",
  },
  11: {
    title: "Gains & Network",
    shortArea: "Income, friends, fulfilment",
    group: "Upachaya",
    groupClass: "upachaya",
  },
  12: {
    title: "Moksha & Release",
    shortArea: "Spirituality, isolation, expenses",
    group: "Moksha",
    groupClass: "moksha",
  },
};

function HouseReadingCard({ house, defaultOpen = false }: HouseReadingCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  const meta = HOUSE_META[house.houseNumber] || {
    title: house.houseName || `House ${house.houseNumber}`,
    shortArea: house.mainArea || "Life area",
    group: "House",
    groupClass: "regular",
  };

  const planets = house.planets ?? [];
  const hasPlanets = planets.length > 0;

  return (
    <article
      className={[
        "house-accordion-card",
        open ? "open" : "",
        hasPlanets ? "has-planets" : "no-planets",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className="house-accordion-button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span className="house-number-orb">{house.houseNumber}</span>

        <span className="house-accordion-main">
          <small>House {house.houseNumber}</small>
          <strong>{meta.title}</strong>
          <em>{meta.shortArea}</em>
        </span>

        <span className={`house-group-badge ${meta.groupClass}`}>
          {meta.group}
        </span>

        <span className="house-expand-icon">{open ? "−" : "+"}</span>
      </button>

      <div className="house-quick-planets">
        {hasPlanets ? (
          planets.map((planet) => (
            <PlanetBadge
              key={`${house.houseNumber}-${planet.name}`}
              name={planet.name}
              compact
            />
          ))
        ) : (
          <span className="house-empty-chip">No planet placed</span>
        )}
      </div>

      {open && (
        <div className="house-expanded-content">
          <div className="house-reading-block">
            <span>Life Area</span>
            <h4>{house.mainArea || meta.shortArea}</h4>
          </div>

          <div className="house-reading-block">
            <span>House Meaning</span>
            <p>{house.meaning || "House meaning is not available."}</p>
          </div>

          <div className="house-reading-block interpretation">
            <span>Interpretation</span>
            <p>
              {house.interpretation ||
                "Interpretation is not available for this house."}
            </p>
          </div>

          {hasPlanets && (
            <div className="house-planet-detail-grid">
              {planets.map((planet) => (
                <div
                  className="house-planet-detail-card"
                  key={`${house.houseNumber}-${planet.name}-details`}
                >
                  <PlanetBadge name={planet.name} compact />

                  <div>
                    <span>Rashi</span>
                    <strong>{planet.rashi || "-"}</strong>
                  </div>

                  <div>
                    <span>Nakshatra</span>
                    <strong>{planet.nakshatra || "-"}</strong>
                  </div>

                  <div>
                    <span>Degree</span>
                    <strong>{planet.degree || "-"}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default HouseReadingCard;