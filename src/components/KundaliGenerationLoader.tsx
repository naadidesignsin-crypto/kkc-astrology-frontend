type KundaliGenerationLoaderProps = {
  stage: string;
};

const generationSteps = [
  {
    key: "birth",
    title: "Reading birth details",
    description: "Validating name, gender, date, time and birth location.",
    matcher: ["birth", "creating"],
  },
  {
    key: "lagna",
    title: "Calculating Lagna and Rashi",
    description: "Preparing core Kundali summary from birth information.",
    matcher: ["lagna", "rashi", "creating"],
  },
  {
    key: "planets",
    title: "Mapping planetary positions",
    description: "Reading planet, house, Rashi and Nakshatra placements.",
    matcher: ["planet"],
  },
  {
    key: "dasha",
    title: "Preparing Dasha and Dosha",
    description: "Calculating Vimshottari Dasha and Mangal Dosha details.",
    matcher: ["dasha", "dosha"],
  },
  {
    key: "report",
    title: "Building Kundali report",
    description: "Creating final tabs, chart, interpretation and PDF data.",
    matcher: ["report", "tabs", "preparing"],
  },
];

function getActiveStepIndex(stage: string) {
  const normalizedStage = stage.toLowerCase();

  const matchedIndex = generationSteps.findIndex((step) =>
    step.matcher.some((keyword) => normalizedStage.includes(keyword))
  );

  return matchedIndex >= 0 ? matchedIndex : 0;
}

function KundaliGenerationLoader({ stage }: KundaliGenerationLoaderProps) {
  const activeStepIndex = getActiveStepIndex(stage);

  return (
    <section className="kundali-loader-card">
      <div className="kundali-loader-orbit" aria-hidden="true">
        <span className="loader-ring loader-ring-one" />
        <span className="loader-ring loader-ring-two" />
        <span className="loader-ring loader-ring-three" />

        <span className="loader-om">ॐ</span>
        <span className="loader-dot loader-dot-one" />
        <span className="loader-dot loader-dot-two" />
        <span className="loader-dot loader-dot-three" />
      </div>

      <div className="kundali-loader-content">
        <p className="report-section-kicker">Kundali Generation</p>
        <h2>{stage || "Preparing Kundali report"}</h2>
        <p>
          Please wait while the system prepares the astrology report step by
          step.
        </p>

        <div className="kundali-loader-steps">
          {generationSteps.map((step, index) => {
            const isDone = index < activeStepIndex;
            const isActive = index === activeStepIndex;

            return (
              <div
                className={[
                  "kundali-loader-step",
                  isDone ? "done" : "",
                  isActive ? "active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={step.key}
              >
                <span>{isDone ? "✓" : index + 1}</span>

                <div>
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default KundaliGenerationLoader;