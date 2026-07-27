import { useState } from "react";

import type { ParasharaSectionResponse } from "../types/kundali";

type ParasharaChapterCardProps = {
  section: ParasharaSectionResponse;
  chapterNumber: number;
  defaultOpen?: boolean;
};

const CHAPTER_META: Record<
  string,
  {
    label: string;
    subtitle: string;
    category: string;
  }
> = {
  CAREER: {
    label: "Career Direction",
    subtitle: "Work, status, responsibility and professional growth",
    category: "Karma",
  },
  MARRIAGE: {
    label: "Marriage & Relationship",
    subtitle: "Spouse, compatibility, partnership and emotional balance",
    category: "Relationship",
  },
  FINANCE: {
    label: "Finance & Wealth",
    subtitle: "Income, savings, gains and material stability",
    category: "Artha",
  },
  HEALTH: {
    label: "Health & Vitality",
    subtitle: "Body strength, discipline, disease resistance and recovery",
    category: "Wellbeing",
  },
  EDUCATION: {
    label: "Education & Intelligence",
    subtitle: "Learning, memory, creativity and decision-making",
    category: "Vidya",
  },
  DHARMA_SPIRITUALITY: {
    label: "Dharma & Spirituality",
    subtitle: "Purpose, faith, inner growth and higher guidance",
    category: "Dharma",
  },
  GENERAL_REMEDIES: {
    label: "Remedies & Guidance",
    subtitle: "Practical spiritual guidance and balanced corrections",
    category: "Remedy",
  },
};

function getMeta(section: ParasharaSectionResponse) {
  return (
    CHAPTER_META[section.sectionKey] || {
      label: section.title || "Parāśara Chapter",
      subtitle: "Astrology interpretation and guidance",
      category: "Reading",
    }
  );
}

function formatChapterNumber(chapterNumber: number) {
  return String(chapterNumber).padStart(2, "0");
}

function ParasharaChapterCard({
  section,
  chapterNumber,
  defaultOpen = false,
}: ParasharaChapterCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const meta = getMeta(section);

  const focusAreas = section.focusAreas || [];
  const observations = section.observations || [];

  return (
    <article className={open ? "parashara-chapter open" : "parashara-chapter"}>
      <button
        type="button"
        className="parashara-chapter-head"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span className="parashara-chapter-number">
          {formatChapterNumber(chapterNumber)}
        </span>

        <span className="parashara-chapter-title">
          <small>{meta.category}</small>
          <strong>{meta.label}</strong>
          <em>{meta.subtitle}</em>
        </span>

        <span className="parashara-chapter-toggle">{open ? "−" : "+"}</span>
      </button>

      <div className="parashara-chapter-preview">
        {focusAreas.length > 0 ? (
          focusAreas.slice(0, 5).map((area) => <span key={area}>{area}</span>)
        ) : (
          <span>No focus areas available</span>
        )}
      </div>

      {open && (
        <div className="parashara-chapter-body">
          <section className="parashara-reading-block main-summary">
            <span>Chapter Summary</span>
            <p>{section.summary || "Summary is not available."}</p>
          </section>

          {observations.length > 0 && (
            <section className="parashara-reading-block">
              <span>Key Observations</span>

              <ul>
                {observations.map((observation) => (
                  <li key={observation}>{observation}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="parashara-reading-block guidance">
            <span>Guidance</span>
            <p>{section.guidance || "Guidance is not available."}</p>
          </section>

          {section.caution && (
            <section className="parashara-reading-block caution">
              <span>Caution</span>
              <p>{section.caution}</p>
            </section>
          )}
        </div>
      )}
    </article>
  );
}

export default ParasharaChapterCard;