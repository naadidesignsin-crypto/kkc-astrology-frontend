import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  clearAdminAuth,
  deleteAdminKundaliReport,
  deleteAllAdminKundaliReports,
  getAdminAuth,
  getAdminKundaliReports,
  updateAdminKundaliReportAccess,
} from "../services/adminApi";
import type {
  AdminKundaliReportApprovalRequest,
  AdminKundaliReportListItem,
  KundaliStatus,
} from "../types/kundali";

const accessFields: {
  key: keyof AdminKundaliReportApprovalRequest;
  label: string;
}[] = [
  { key: "showSummary", label: "Summary / Basic Birth Details" },
  { key: "showConsultation", label: "Consultation" },
  { key: "showBirthChart", label: "Birth Chart" },
  { key: "showPlanets", label: "Planets" },
  { key: "showHouses", label: "Houses" },
  { key: "showNavamsa", label: "Navamsa" },
  { key: "showParashara", label: "Parāśara" },
  { key: "showDasha", label: "Dasha" },
  { key: "showDosha", label: "Dosha" },
  { key: "showPdf", label: "PDF" },
];

function toAccessPayload(report: AdminKundaliReportListItem): AdminKundaliReportApprovalRequest {
  return {
    showSummary: report.showSummary,
    showConsultation: report.showConsultation,
    showBirthChart: report.showBirthChart,
    showPlanets: report.showPlanets,
    showHouses: report.showHouses,
    showNavamsa: report.showNavamsa,
    showParashara: report.showParashara,
    showDasha: report.showDasha,
    showDosha: report.showDosha,
    showPdf: report.showPdf,
  };
}

function getAccessBadge(report: AdminKundaliReportListItem) {
  const basicOnly =
    report.showSummary &&
    report.showConsultation &&
    !report.showBirthChart &&
    !report.showPlanets &&
    !report.showHouses &&
    !report.showNavamsa &&
    !report.showParashara &&
    !report.showDasha &&
    !report.showDosha &&
    !report.showPdf;

  const standard =
    report.showSummary &&
    report.showConsultation &&
    report.showBirthChart &&
    report.showPlanets &&
    report.showHouses &&
    !report.showNavamsa &&
    !report.showParashara &&
    !report.showDasha &&
    !report.showDosha &&
    !report.showPdf;

  const full = accessFields.every((field) => Boolean(report[field.key]));

  if (full) return "FULL";
  if (standard) return "STANDARD";
  if (basicOnly) return "BASIC";
  return "CUSTOM";
}

function AdminKundaliReportsPage() {
  const navigate = useNavigate();

  const [reports, setReports] = useState<AdminKundaliReportListItem[]>([]);
  const [status, setStatus] = useState<KundaliStatus | "">("");
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedReport, setSelectedReport] = useState<AdminKundaliReportListItem | null>(null);
  const [accessDraft, setAccessDraft] = useState<AdminKundaliReportApprovalRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const currentAccessBadge = useMemo(
    () => (selectedReport ? getAccessBadge({ ...selectedReport, ...(accessDraft || {}) }) : ""),
    [selectedReport, accessDraft]
  );

  useEffect(() => {
    if (!getAdminAuth()) {
      navigate("/admin/login");
      return;
    }

    void loadReports(0, status, appliedSearch);
  }, [navigate, status, appliedSearch]);

  async function loadReports(nextPage = page, nextStatus = status, nextSearch = appliedSearch) {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminKundaliReports(nextPage, 20, nextStatus, nextSearch);
      setReports(data.content);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load Kundali reports.");
      if (err instanceof Error && err.message.includes("Admin session")) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    setAppliedSearch(searchInput.trim());
    setPage(0);
  }

  function clearSearch() {
    setSearchInput("");
    setAppliedSearch("");
    setPage(0);
  }

  function openAccessEditor(report: AdminKundaliReportListItem) {
    setSelectedReport(report);
    setAccessDraft(toAccessPayload(report));
    setError("");
  }

  function applyBasicApproval() {
    setAccessDraft({
      showSummary: true,
      showConsultation: true,
      showBirthChart: false,
      showPlanets: false,
      showHouses: false,
      showNavamsa: false,
      showParashara: false,
      showDasha: false,
      showDosha: false,
      showPdf: false,
    });
  }

  function applyStandardApproval() {
    setAccessDraft({
      showSummary: true,
      showConsultation: true,
      showBirthChart: true,
      showPlanets: true,
      showHouses: true,
      showNavamsa: false,
      showParashara: false,
      showDasha: false,
      showDosha: false,
      showPdf: false,
    });
  }

  function applyFullApproval() {
    setAccessDraft({
      showSummary: true,
      showConsultation: true,
      showBirthChart: true,
      showPlanets: true,
      showHouses: true,
      showNavamsa: true,
      showParashara: true,
      showDasha: true,
      showDosha: true,
      showPdf: true,
    });
  }

  async function saveAccess() {
    if (!selectedReport || !accessDraft) return;

    try {
      setActionLoading(true);
      setError("");
      await updateAdminKundaliReportAccess(selectedReport.id, accessDraft);
      setSelectedReport(null);
      setAccessDraft(null);
      await loadReports(page, status, appliedSearch);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update report access.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteReport(report: AdminKundaliReportListItem) {
    const confirmed = window.confirm(
      `Delete Kundali report #${report.id} / Order ID ${report.orderId} for ${report.fullName}?`
    );
    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");
      await deleteAdminKundaliReport(report.id);
      await loadReports(page, status, appliedSearch);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete report.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteAll() {
    const firstConfirm = window.confirm("This will delete all generated Kundali reports. Continue?");
    if (!firstConfirm) return;

    const typed = window.prompt("Type DELETE_ALL_KUNDALI_REPORTS to confirm.");
    if (typed !== "DELETE_ALL_KUNDALI_REPORTS") {
      setError("Delete all cancelled. Confirmation text did not match.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      await deleteAllAdminKundaliReports();
      await loadReports(0, status, appliedSearch);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete all reports.");
    } finally {
      setActionLoading(false);
    }
  }

  function logout() {
    clearAdminAuth();
    navigate("/admin/login");
  }

  return (
    <main className="kkc-admin-page">
      <section className="kkc-admin-reports-card">
        <div className="kkc-admin-head">
          <div>
            <p className="report-section-kicker">Admin Reports</p>
            <h1>Kundali generated reports</h1>
            <p>
              Search reports by Order ID, name or birth place. Section approval generates advanced sections on the backend.
            </p>
          </div>

          <div className="kkc-admin-actions">
            <button type="button" onClick={logout}>Logout</button>
            <button type="button" className="danger" onClick={handleDeleteAll} disabled={actionLoading || reports.length === 0}>Delete All</button>
          </div>
        </div>

        <form className="kkc-admin-toolbar kkc-admin-toolbar-grid" onSubmit={handleSearchSubmit}>
          <label>
            Search
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Order ID / name / place"
            />
          </label>

          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value as KundaliStatus | "")}>
              <option value="">All</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </label>

          <button type="submit" disabled={loading}>Search</button>
          <button type="button" onClick={clearSearch} disabled={loading || (!searchInput && !appliedSearch)}>Clear</button>
          <strong>{totalElements} reports</strong>
        </form>

        {loading && <p>Loading reports...</p>}
        {error && <p className="kkc-form-error">{error}</p>}
        {!loading && reports.length === 0 && <p>No Kundali reports found.</p>}

        {!loading && reports.length > 0 && (
          <div className="kkc-admin-table-wrap">
            <table className="kkc-admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Name</th>
                  <th>Birth Details</th>
                  <th>Place</th>
                  <th>Status</th>
                  <th>Access</th>
                  <th>Visible Sections</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td><strong>{report.orderId}</strong><span>Report #{report.id}</span></td>
                    <td><strong>{report.fullName}</strong><span>{report.gender || "-"}</span></td>
                    <td>{report.dateOfBirth}<br />{report.timeOfBirth}</td>
                    <td>{report.birthPlace}</td>
                    <td><span className={`admin-status ${report.status.toLowerCase()}`}>{report.status}</span></td>
                    <td><span className={`admin-access-badge ${getAccessBadge(report).toLowerCase()}`}>{getAccessBadge(report)}</span></td>
                    <td>
                      <div className="admin-visible-tags">
                        {report.showSummary && <span>Summary</span>}
                        {report.showConsultation && <span>Consult</span>}
                        {report.showBirthChart && <span>Chart</span>}
                        {report.showPlanets && <span>Planets</span>}
                        {report.showHouses && <span>Houses</span>}
                        {report.showNavamsa && <span>Navamsa</span>}
                        {report.showParashara && <span>Parāśara</span>}
                        {report.showDasha && <span>Dasha</span>}
                        {report.showDosha && <span>Dosha</span>}
                        {report.showPdf && <span>PDF</span>}
                      </div>
                    </td>
                    <td>{new Date(report.createdAt).toLocaleString("en-IN")}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" className="small" disabled={actionLoading} onClick={() => openAccessEditor(report)}>Manage Access</button>
                        <button type="button" className="danger small" disabled={actionLoading} onClick={() => handleDeleteReport(report)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="kkc-admin-pagination">
          <button type="button" disabled={page <= 0 || loading} onClick={() => void loadReports(page - 1, status, appliedSearch)}>Previous</button>
          <span>Page {page + 1} of {Math.max(totalPages, 1)}</span>
          <button type="button" disabled={page + 1 >= totalPages || loading} onClick={() => void loadReports(page + 1, status, appliedSearch)}>Next</button>
        </div>
      </section>

      {selectedReport && accessDraft && (
        <section className="kkc-admin-access-panel">
          <div className="kkc-admin-access-card">
            <div className="kkc-admin-head">
              <div>
                <p className="report-section-kicker">Section Approval</p>
                <h2>{selectedReport.fullName}</h2>
                <p>Order ID: {selectedReport.orderId}</p>
                <span className={`admin-access-badge ${currentAccessBadge.toLowerCase()}`}>{currentAccessBadge}</span>
              </div>
              <button type="button" onClick={() => { setSelectedReport(null); setAccessDraft(null); }}>Close</button>
            </div>

            <div className="approval-presets">
              <button type="button" onClick={applyBasicApproval}>Basic</button>
              <button type="button" onClick={applyStandardApproval}>Standard</button>
              <button type="button" onClick={applyFullApproval}>Full</button>
            </div>

            <p className="admin-approval-note">
              Saving access will update visibility and generate required advanced sections in backend.
            </p>

            <div className="approval-checkbox-grid">
              {accessFields.map((field) => (
                <label key={field.key}>
                  <input
                    type="checkbox"
                    checked={Boolean(accessDraft[field.key])}
                    onChange={(event) => setAccessDraft((current) => current ? { ...current, [field.key]: event.target.checked } : current)}
                  />
                  <span>{field.label}</span>
                </label>
              ))}
            </div>

            <button type="button" className="save-access-btn" onClick={saveAccess} disabled={actionLoading}>
              {actionLoading ? "Saving and Generating..." : "Save Access"}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default AdminKundaliReportsPage;
