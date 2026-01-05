import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Verify from './pages/Verify';
import ForgotPassword from './pages/ForgotPassword';
import ForgotVerify from './pages/ForgotVerify';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import UserHistory from './pages/UserHistory';
import AdminHistory from './pages/AdminHistory';
import Metrics from './pages/Metrics';
import PersonnelDashboard from './pages/PersonnelDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-verify" element={<ForgotVerify />} />

      {/* User routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={["USER"]}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute allowedRoles={["USER"]}>
          <UserHistory />
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/history" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminHistory />
        </ProtectedRoute>
      } />
      <Route path="/admin/metrics" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <Metrics />
        </ProtectedRoute>
      } />

      {/* Personnel routes */}
      <Route path="/personneldashboard" element={
        <ProtectedRoute allowedRoles={["PERSONNEL"]}>
          <PersonnelDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
