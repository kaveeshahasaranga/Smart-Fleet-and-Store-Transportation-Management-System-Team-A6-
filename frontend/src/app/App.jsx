import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import TeamPages from './TeamPages.jsx';
import '../styles/portal.css';
import MainLayout from '../layouts/MainLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import BookingPage from '../features/bookings/BookingPage.jsx';
import AdminBookingReviewQueue from '../features/bookings/AdminBookingReviewQueue.jsx';
import VehiclesPage from '../features/vehicles/VehiclesPage.jsx';
import ItemsPage from '../features/items/ItemsPage.jsx';
import AdminOverviewPage from '../pages/AdminOverviewPage.jsx';
import TripPlannerPage from '../features/trips/TripPlannerPage.jsx';
import TripPlanningPage from '../features/trips/TripPlanningPage.jsx';
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

export default function App() {
  return (
    <FleetProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<TeamPages />} />
          <Route element={<div className="fleet-portal"><MainLayout /></div>}>
            <Route path="signin" element={<SignInPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="handover" element={<GoodsHandoverPage />} />
            <Route path="receipt-confirmation" element={<ReceiptConfirmationPage />} />
            <Route path="discrepancy-note" element={<DiscrepancyNotePage />} />
            <Route path="bookings/create" element={<BookingPage />} />
            <Route path="*" element={<p>Page not found.</p>} />
          </Route>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<AdminOverviewPage />} />
            <Route path="bookings" element={<AdminBookingReviewQueue />} />
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="items" element={<ItemsPage />} />
            <Route path="trips" element={<TripPlanningPage />} />
            <Route path="trips/sequence" element={<TripPlannerPage />} />
            <Route path="*" element={<><h1>Admin page not found</h1><a href="/admin/vehicles">Return to vehicles</a></>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FleetProvider>
  );
}
