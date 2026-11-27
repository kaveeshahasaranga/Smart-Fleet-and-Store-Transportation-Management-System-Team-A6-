import { useSyncExternalStore } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import TeamPages from './TeamPages.jsx';
import '../styles/portal.css';
import MainLayout from '../layouts/MainLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import BookingPage from '../features/bookings/BookingPage.jsx';
import BookingsPage from '../features/bookings/BookingsPage.jsx';
import AdminBookingsPage from '../features/bookings/AdminBookingsPage.jsx';
import VehiclesPage from '../features/vehicles/VehiclesPage.jsx';
import ItemsPage from '../features/items/ItemsPage.jsx';
import {
  ForgotPasswordPage,
  ResetPasswordPage,
  SignInPage,
  SignUpPage,
} from '../features/auth/AuthPages.jsx';
import {
  DiscrepancyNotePage,
  GoodsHandoverPage,
  ReceiptConfirmationPage,
} from '../features/handover/HandoverPages.jsx';
import { FleetProvider } from '../context/FleetContext.jsx';
import { getApiAccessToken, getApiCurrentUser, subscribeToApiAuth } from '../services/api.js';

function RequireAuth() {
  const token = useSyncExternalStore(subscribeToApiAuth, getApiAccessToken, () => null);
  return token ? <Outlet /> : <Navigate to="/signin" replace />;
}

function RequireAdmin() {
  const user = useSyncExternalStore(subscribeToApiAuth, getApiCurrentUser, () => null);
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
}

function RequireStore() {
  const user = useSyncExternalStore(subscribeToApiAuth, getApiCurrentUser, () => null);
  return user?.role === 'store' ? <Outlet /> : <Navigate to="/admin/vehicles" replace />;
}

function RoleHome() {
  const user = getApiCurrentUser();
  return user?.role === 'admin' ? <TeamPages /> : <div className="fleet-portal"><BookingPage /></div>;
}

export default function App() {
  return (
    <FleetProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<div className="fleet-portal"><MainLayout /></div>}>
            <Route path="signin" element={<SignInPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route index element={<RoleHome />} />
            <Route element={<div className="fleet-portal"><MainLayout /></div>}>
              <Route path="bookings/create" element={<BookingPage />} />
            </Route>
            <Route element={<RequireStore />}>
              <Route element={<div className="fleet-portal"><MainLayout /></div>}>
                <Route path="handover" element={<GoodsHandoverPage />} />
                <Route path="receipt-confirmation" element={<ReceiptConfirmationPage />} />
                <Route path="discrepancy-note" element={<DiscrepancyNotePage />} />
                <Route path="bookings" element={<BookingsPage />} />
                <Route path="*" element={<p>Page not found.</p>} />
              </Route>
            </Route>
            <Route element={<RequireAdmin />}>
              <Route path="admin" element={<div className="fleet-portal"><AdminLayout /></div>}>
                <Route index element={<Navigate to="vehicles" replace />} />
                <Route path="vehicles" element={<VehiclesPage />} />
                <Route path="items" element={<ItemsPage />} />
                <Route path="bookings" element={<AdminBookingsPage />} />
                <Route path="*" element={<><h1>Admin page not found</h1><a href="/admin/vehicles">Return to vehicles</a></>} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </FleetProvider>
  );
}
