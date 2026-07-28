import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  clearAdminAuth,
  deleteAdminKundaliReport,
  deleteAllAdminKundaliReports,
  getAdminAuth,
  getAdminKundaliReports,
} from "../services/adminApi";
import type {
  AdminKundaliReportListItem,
  KundaliStatus,
} from "../types/kundali";

function AdminKundaliReportsPage() {
  const navigate = useNavigate();

  const [reports, setReports] = useState<AdminKundaliReportListItem[]>([]);
  const [status, setStatus] = useState<KundaliStatus | "">("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getAdminAuth()) {
      navigate("/admin/login");
      return;
    }

    void loadReports(0, status);
  }, [navigate, status]);

  async function loadReports(nextPage = page, nextStatus = status) {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminKundaliReports(nextPage, 20, nextStatus);

      setReports(data.content);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Kundali reports."
      );

      if (err instanceof Error && err.message.includes("Admin session")) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteReport(report: AdminKundaliReportListItem) {
    const confirmed = window.confirm(
      `Delete Kundali report #${report.id} for ${report.fullName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await deleteAdminKundaliReport(report.id);
      await loadReports(page, status);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete report."
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteAll() {
    const firstConfirm = window.confirm(
      "This will delete all generated Kundali reports. Continue?"
    );

    if (!firstConfirm) {
      return;
    }

    const typed = window.prompt(
      "Type DELETE_ALL_KUNDALI_REPORTS to confirm."
    );

    if (typed !== "DELETE_ALL_KUNDALI_REPORTS") {
      setError("Delete all cancelled. Confirmation text did not match.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await deleteAllAdminKundaliReports();
      await loadReports(0, status);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete all reports."
      );
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
              Private report list. Only admin users should access this section.
            </p>
          </div>

          <div className="kkc-admin-actions">
            <button type="button" onClick={logout}>
              Logout
            </button>

            <button
              type="button"
              className="danger"
              onClick={handleDeleteAll}
              disabled={actionLoading || reports.length === 0}
            >
              Delete All
            </button>
          </div>
        </div>

        <div className="kkc-admin-toolbar">
          <label>
            Status
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as KundaliStatus | "")
              }
            >
              <option value="">All</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </label>

          <strong>{totalElements} reports</strong>
        </div>

        {loading && <p>Loading reports...</p>}

        {error && <p className="kkc-form-error">{error}</p>}

        {!loading && reports.length === 0 && (
          <p>No Kundali reports found.</p>
        )}

        {!loading && reports.length > 0 && (
          <div className="kkc-admin-table-wrap">
            <table className="kkc-admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Birth Details</th>
                  <th>Place</th>
                  <th>Rashi</th>
                  <th>Nakshatra</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>#{report.id}</td>
                    <td>
                      <strong>{report.fullName}</strong>
                      <span>{report.gender || "-"}</span>
                    </td>
                    <td>
                      {report.dateOfBirth}
                      <br />
                      {report.timeOfBirth}
                    </td>
                    <td>{report.birthPlace}</td>
                    <td>{report.rashi || "-"}</td>
                    <td>{report.nakshatra || "-"}</td>
                    <td>
                      <span className={`admin-status ${report.status.toLowerCase()}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>{new Date(report.createdAt).toLocaleString("en-IN")}</td>
                    <td>
                      <button
                        type="button"
                        className="danger small"
                        disabled={actionLoading}
                        onClick={() => handleDeleteReport(report)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="kkc-admin-pagination">
          <button
            type="button"
            disabled={page <= 0 || loading}
            onClick={() => void loadReports(page - 1, status)}
          >
            Previous
          </button>

          <span>
            Page {page + 1} of {Math.max(totalPages, 1)}
          </span>

          <button
            type="button"
            disabled={page + 1 >= totalPages || loading}
            onClick={() => void loadReports(page + 1, status)}
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}

export default AdminKundaliReportsPage;