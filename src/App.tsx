import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import KundaliPage from "./pages/KundaliPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminKundaliReportsPage from "./pages/AdminKundaliReportsPage";
import "./styles/kkc/index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/kundali-reports" element={<AdminKundaliReportsPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/kundali" element={<KundaliPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;