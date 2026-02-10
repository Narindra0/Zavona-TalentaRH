import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CandidateList from './pages/CandidateList';
import CandidateProfile from './pages/CandidateProfile';
import Login from './pages/Login';
import ApplyPage from './pages/ApplyPage';
import Dashboard from './pages/admin/Dashboard';
import EditSite from './pages/admin/EditSite';
import CandidateDetail from './pages/admin/CandidateDetail';
import AddCandidate from './pages/admin/AddCandidate';
import CategorizationManager from './pages/admin/CategorizationManager';
import TalentOffers from './pages/admin/TalentOffers';
import EmailConfiguration from './pages/admin/EmailConfiguration';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes Publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/talents" element={<CandidateList />} />
        <Route path="/talents/:id" element={<CandidateProfile />} />
        <Route path="/login" element={<Login />} />
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