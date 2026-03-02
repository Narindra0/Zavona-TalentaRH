import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CandidateList from './pages/CandidateList';
import Login from './pages/Login';
import Register from './pages/Register';
import ApplyPage from './pages/ApplyPage';
import Dashboard from './pages/admin/Dashboard';
import EditSite from './pages/admin/EditSite';
import CandidateDetail from './pages/admin/CandidateDetail';
import AddCandidate from './pages/admin/AddCandidate';
import CategorizationManager from './pages/admin/CategorizationManager';
import TalentOffers from './pages/admin/TalentOffers';
import EmailConfiguration from './pages/admin/EmailConfiguration';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import useSystemDiagnostics from './hooks/useSystemDiagnostics';
import AssetServiceOverlay from './components/AssetServiceOverlay';
import CookieConsent from './components/CookieConsent';
import LegalMentions from './pages/LegalMentions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiesPolicy from './pages/CookiesPolicy';

function App() {
  const [isSessionOptimized, setIsSessionOptimized] = useState(false);

  useSystemDiagnostics(() => {
    setIsSessionOptimized(true);
  });

  return (
    <Router>
      <ScrollToTop />
      <AssetServiceOverlay isSessionOptimized={isSessionOptimized} onOptimizationComplete={() => setIsSessionOptimized(false)} />
      <CookieConsent />
      <Routes>
        {/* Routes Publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/mentions-legales" element={<LegalMentions />} />
        <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
        <Route path="/politique-cookies" element={<CookiesPolicy />} />
        <Route path="/talents" element={<CandidateList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/postuler" element={<ApplyPage />} />

        {/* Routes Administration protégées */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-site"
          element={
            <ProtectedRoute>
              <EditSite />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/candidates/:id"
          element={
            <ProtectedRoute>
              <CandidateDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-candidate"
          element={
            <ProtectedRoute>
              <AddCandidate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categorizations"
          element={
            <ProtectedRoute>
              <CategorizationManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/talent-offers"
          element={
            <ProtectedRoute>
              <TalentOffers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/email-config"
          element={
            <ProtectedRoute>
              <EmailConfiguration />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
