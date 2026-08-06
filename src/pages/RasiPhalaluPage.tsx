import { Link } from "react-router-dom";

import kkcLogo from "../assets/Logo.png";
import BlackWhiteCosmicBackground from "../components/BlackWhiteCosmicBackground";
import DailyRasiPhalalu from "../components/DailyRasiPhalalu";

function RasiPhalaluPage() {
  return (
    <main className="kkc-rasi-page">
      <BlackWhiteCosmicBackground />

      <header className="kkc-header kkc-rasi-page-header">
        <Link to="/" className="kkc-brand" aria-label="KKC Home">
          <img src={kkcLogo} alt="KKC Logo" />

          <span>
            <strong>KKC</strong>
            <small>Kundalini Kriya Chaitanyam</small>
          </span>
        </Link>

        <nav className="kkc-nav" aria-label="Rasi Phalalu navigation">
          <Link to="/">Home</Link>
          <a href="#daily-rasi">Rasi Phalalu</a>
          <Link to="/panchangam">Panchangam</Link>
          <Link to="/kundali">Kundali</Link>
        </nav>

        <Link className="kkc-outline-btn" to="/kundali">
          Generate Order ID
        </Link>
      </header>

      <section className="kkc-rasi-page-hero">
        <p className="kkc-eyebrow">Daily Rasi Phalalu</p>

        <h1>12 Rasis Daily, Weekly and Monthly Predictions</h1>

        <p>
          Select your Rasi and view Daily, Weekly and Monthly predictions with
          career, finance, health, family, love, lucky details and planetary
          influence in a clean readable format.
        </p>

        <div className="kkc-rasi-page-actions">
          <Link className="kkc-white-btn" to="/kundali">
            Generate Kundali Order ID
          </Link>

          <Link className="kkc-outline-btn" to="/panchangam">
            View Panchangam
          </Link>
        </div>
      </section>

      <DailyRasiPhalalu fullPage />
    </main>
  );
}

export default RasiPhalaluPage;