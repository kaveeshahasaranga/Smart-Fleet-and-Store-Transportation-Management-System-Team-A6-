import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import BookingPage from '../features/bookings/BookingPage.jsx';
import AdminBookingReviewQueue from '../features/bookings/AdminBookingReviewQueue.jsx';
import VehiclesPage from '../features/vehicles/VehiclesPage.jsx';
import ItemsPage from '../features/items/ItemsPage.jsx';
import AdminOverviewPage from '../pages/AdminOverviewPage.jsx';
import TripPlannerPage from '../features/trips/TripPlannerPage.jsx';
import TripPlanningPage from '../features/trips/TripPlanningPage.jsx';
import { FleetProvider } from '../context/FleetContext.jsx';
export default function App() {
  return <FleetProvider><BrowserRouter><Routes><Route element={<MainLayout />}>
    <Route index element={<Navigate to="/bookings/create" replace />} />
    <Route path="bookings/create" element={<BookingPage />} />

    <Route path="*" element={<><h1>Page not found</h1><a href="/">Return to workspace</a></>} />
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
  </Route></Routes></BrowserRouter></FleetProvider>;
}
