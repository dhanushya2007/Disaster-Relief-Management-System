import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import DisasterManagement from './pages/admin/DisasterManagement';
import ResourceManagement from './pages/admin/ResourceManagement';
import ReliefRequests from './pages/admin/ReliefRequests';
import Distribution from './pages/admin/Distribution';
import Reports from './pages/admin/Reports';
import AuditLogs from './pages/admin/AuditLogs';

// Citizen
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import CitizenDisasters from './pages/citizen/CitizenDisasters';
import CitizenRequests from './pages/citizen/CitizenRequests';
import CitizenProfile from './pages/citizen/CitizenProfile';

function AdminLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function CitizenLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="CITIZEN">
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin/disasters" element={<AdminLayout><DisasterManagement /></AdminLayout>} />
              <Route path="/admin/resources" element={<AdminLayout><ResourceManagement /></AdminLayout>} />
              <Route path="/admin/requests" element={<AdminLayout><ReliefRequests /></AdminLayout>} />
              <Route path="/admin/distribution" element={<AdminLayout><Distribution /></AdminLayout>} />
              <Route path="/admin/reports" element={<AdminLayout><Reports /></AdminLayout>} />
              <Route path="/admin/audit-logs" element={<AdminLayout><AuditLogs /></AdminLayout>} />

              {/* Citizen Routes */}
              <Route path="/citizen/dashboard" element={<CitizenLayout><CitizenDashboard /></CitizenLayout>} />
              <Route path="/citizen/disasters" element={<CitizenLayout><CitizenDisasters /></CitizenLayout>} />
              <Route path="/citizen/requests" element={<CitizenLayout><CitizenRequests /></CitizenLayout>} />
              <Route path="/citizen/profile" element={<CitizenLayout><CitizenProfile /></CitizenLayout>} />

              {/* Default */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="colored"
          />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
