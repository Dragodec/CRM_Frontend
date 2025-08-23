// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFoundPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import RoleRoute from './components/Auth/RoleRoute';

import DashboardPage from './pages/DashboardPage';
import Layout from './layout/Layout';
import UsersPage from './pages/UsersPage';
import UserViewPage from './pages/UserViewPage';
import ProfilePage from './pages/ProfilePage';
import CustomerPage from './pages/CustomerPage';
import CustomerViewPage from './pages/CustomerViewPage';
import LeadPage from './pages/LeadPage';
import LeadViewPage from './pages/LeadViewPage';
import ProductPage from './pages/ProductPage';
import AnalystDashboard from './pages/AnalystPage';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>

            {/* Accessible by all authenticated users */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* ADMIN + SUPER_ADMIN */}
            <Route element={<RoleRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />}>
              <Route path="/users" element={<UsersPage />} />
              <Route path="/viewUser/:id" element={<UserViewPage />} />
            </Route>

            {/* SALES_REP + ADMIN + SUPER_ADMIN */}
            <Route element={<RoleRoute allowedRoles={["SALES_REP", "ADMIN", "SUPER_ADMIN"]} />}>
              <Route path="/customers" element={<CustomerPage />} />
              <Route path="/viewCustomer/:id" element={<CustomerViewPage />} />
              <Route path="/leads" element={<LeadPage />} />
              <Route path="/viewLead/:id" element={<LeadViewPage />} />
              <Route path="/products" element={<ProductPage />} />
            </Route>

            {/* ANALYST + ADMIN + SUPER_ADMIN */}
            <Route element={<RoleRoute allowedRoles={["ANALYST", "ADMIN", "SUPER_ADMIN"]} />}>
              <Route path="/analyst" element={<AnalystDashboard />} />
            </Route>

          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound fullPage />} />
      </Routes>
    </div>
  );
}
