import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import TeamPages from './TeamPages.jsx';
import '../styles/portal.css';
import MainLayout from '../layouts/MainLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import BookingPage from '../features/bookings/BookingPage.jsx';
import VehiclesPage from '../features/vehicles/VehiclesPage.jsx';
import ItemsPage from '../features/items/ItemsPage.jsx';
import { FleetProvider } from '../context/FleetContext.jsx';
export default function App() {
  return <FleetProvider><BrowserRouter><Routes>
    <Route index element={<TeamPages />} />
    <Route element={<div className="fleet-portal"><MainLayout /></div>}>
    <Route path="bookings/create" element={<BookingPage />} />

    <Route path="*" element={<><h1>Page not found</h1><a href="/">Return to workspace</a></>} />
  </Route>
  <Route path="admin" element={<div className="fleet-portal"><AdminLayout /></div>}>
    <Route index element={<Navigate to="vehicles" replace />} />
    <Route path="vehicles" element={<VehiclesPage />} />
    <Route path="items" element={<ItemsPage />} />
    <Route path="*" element={<><h1>Admin page not found</h1><a href="/admin/vehicles">Return to vehicles</a></>} />
  </Route></Routes></BrowserRouter></FleetProvider>;
}
