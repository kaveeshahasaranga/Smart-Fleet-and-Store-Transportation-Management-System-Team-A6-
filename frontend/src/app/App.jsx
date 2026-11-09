import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import BookingPage from '../features/bookings/BookingPage.jsx';
import VehiclesPage from '../features/vehicles/VehiclesPage.jsx';
import ItemsPage from '../features/items/ItemsPage.jsx';
import { FleetProvider } from '../context/FleetContext.jsx';
export default function App() {
  return <FleetProvider><BrowserRouter><Routes><Route element={<MainLayout />}>
    <Route index element={<Navigate to="/bookings/create" replace />} />
    <Route path="bookings/create" element={<BookingPage />} />
    <Route path="admin/vehicles" element={<VehiclesPage />} />
    <Route path="admin/items" element={<ItemsPage />} />
    <Route path="*" element={<><h1>Page not found</h1><a href="/">Return to workspace</a></>} />
  </Route></Routes></BrowserRouter></FleetProvider>;
}
