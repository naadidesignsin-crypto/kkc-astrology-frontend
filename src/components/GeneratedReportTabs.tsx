import type { ReactNode } from "react";
import type { UiLanguage } from "../types/language";

export type ReportTabId =
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

export type ReportTabItem = {
  id: ReportTabId;
  labelEn: string;
  labelTe: string;
  disabled?: boolean;
  content: ReactNode;
};

type GeneratedReportTabsProps = {
  language: UiLanguage;
  activeTab: ReportTabId;
  onTabChange: (tab: ReportTabId) => void;
  tabs: ReportTabItem[];
};

function GeneratedReportTabs({
  language,
  activeTab,
  onTabChange,
  tabs,
}: GeneratedReportTabsProps) {
  const isTelugu = language === "te";
  const activeTabData = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="generated-report-workspace">
      <div className="report-tabs-header">
        <div>
          <p className="eyebrow">
            {isTelugu ? "జాతక రిపోర్ట్" : "Kundali Report"}
          </p>

          <h2>
            {isTelugu
              ? "రిపోర్ట్ విభాగాలు"
              : "Generated Report Sections"}
          </h2>

          <p>
            {isTelugu
              ? "ప్రతి విభాగాన్ని విడిగా చూడడానికి ట్యాబ్‌ను ఎంచుకోండి."
              : "Use tabs to view each report section without long scrolling."}
          </p>
        </div>
      </div>

      <div className="report-tabs-scroll" role="tablist">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={tab.id === activeTab ? "report-tab active" : "report-tab"}
            onClick={() => onTabChange(tab.id)}
            disabled={tab.disabled}
            role="tab"
            aria-selected={tab.id === activeTab}
          >
            {isTelugu ? tab.labelTe : tab.labelEn}
          </button>
        ))}
      </div>

      <div className="report-tab-content">{activeTabData.content}</div>
    </div>
  );
}

export default GeneratedReportTabs;