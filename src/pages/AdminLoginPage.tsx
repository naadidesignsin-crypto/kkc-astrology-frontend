import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { verifyAdminLogin } from "../services/adminApi";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await verifyAdminLogin(username.trim(), password);

      navigate("/admin/kundali-reports");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to login as admin."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="kkc-admin-page">
      <section className="kkc-admin-login-card">
        <p className="report-section-kicker">Admin Access</p>
        <h1>KKC Admin Login</h1>
        <p>
          Login is required to view generated Kundali reports and delete private
          report data.
        </p>

        <form onSubmit={handleSubmit} className="kkc-admin-form">
          <label>
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter admin username"
              autoComplete="username"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter admin password"
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="kkc-form-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLoginPage;