import type { UiLanguage } from "../types/language";

export type KundaliGenerationStage =
  | "creating"
  | "planets"
  | "dasha"
  | "dosha"
  | "fetching";

type KundaliGeneratingLoaderProps = {
  language: UiLanguage;
  stage: KundaliGenerationStage;
};

const steps = [
  {
    id: "creating",
    labelTe: "జాతక రిపోర్ట్ సిద్ధం చేస్తోంది",
    labelEn: "Creating Kundali report",
  },
  {
    id: "planets",
    labelTe: "గ్రహ స్థానాలు లెక్కిస్తోంది",
    labelEn: "Generating planetary positions",
  },
  {
    id: "dasha",
    labelTe: "విమ్షోత్తరి మహాదశ సిద్ధం చేస్తోంది",
    labelEn: "Calculating Vimshottari Dasha",
  },
  {
    id: "dosha",
    labelTe: "మంగళ దోషం పరిశీలిస్తోంది",
    labelEn: "Checking Mangal Dosha",
  },
  {
    id: "fetching",
    labelTe: "చివరి జాతక వివరాలు సిద్ధం చేస్తోంది",
    labelEn: "Preparing final Kundali report",
  },
] as const;

function KundaliGeneratingLoader({
  language,
  stage,
}: KundaliGeneratingLoaderProps) {
  const isTelugu = language === "te";
  const activeIndex = steps.findIndex((step) => step.id === stage);

  return (
    <div className="kundali-loader-card">
      <div className="loader-orb-wrap">
        <div className="loader-orb">
          <span>ॐ</span>
          <i className="loader-ring loader-ring-one" />
          <i className="loader-ring loader-ring-two" />
          <i className="loader-ring loader-ring-three" />
        </div>
      </div>

      <div className="loader-copy">
        <p className="eyebrow">
          {isTelugu ? "జాతకం రూపొందుతోంది" : "Generating Kundali"}
        </p>

        <h2>
          {isTelugu
            ? "గ్రహ స్థితులు లెక్కించబడుతున్నాయి"
            : "Calculating planetary details"}
        </h2>

        <p>
          {isTelugu
            ? "జనన వివరాల ఆధారంగా జాతక సారాంశం, గ్రహ స్థానాలు, దశ మరియు దోష వివరాలు సిద్ధం చేస్తున్నాం."
            : "Preparing Kundali summary, planetary positions, dasha, and dosha details from the birth data."}
        </p>

        <div className="loader-progress-track">
          <span
            style={{
              width: `${((activeIndex + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        <div className="loader-steps">
          {steps.map((step, index) => {
            const isDone = index < activeIndex;
            const isActive = index === activeIndex;

            return (
              <div
                className={[
                  "loader-step",
                  isDone ? "done" : "",
                  isActive ? "active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={step.id}
              >
                <span>{isDone ? "✓" : index + 1}</span>
                <strong>{isTelugu ? step.labelTe : step.labelEn}</strong>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default KundaliGeneratingLoader;