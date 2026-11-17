import { createContext, useContext, useState } from 'react';
const FleetContext = createContext(null);
const initialItems = [
  { id: 'ITM-001', name: 'Rice bags', category: 'Dry goods', unit: 'bag', weight: 25, status: 'Active' },
  { id: 'ITM-002', name: 'Milk cartons', category: 'Dairy', unit: 'carton', weight: 12, status: 'Active' },
  { id: 'ITM-003', name: 'Fresh vegetables', category: 'Produce', unit: 'crate', weight: 15, status: 'Active' },
];
const initialVehicles = [
  { id: 'VEH-001', registration: 'WP LK-4821', name: 'Delivery Truck 01', type: 'Truck', capacity: 3500, driver: 'Nimal Perera', status: 'Available' },
  { id: 'VEH-002', registration: 'WP CAD-7392', name: 'Delivery Van 02', type: 'Van', capacity: 1000, driver: 'Kamal Silva', status: 'In transit' },
  { id: 'VEH-003', registration: 'CP LB-2156', name: 'Delivery Truck 03', type: 'Truck', capacity: 5000, driver: 'Sunil Fernando', status: 'Maintenance' },
  { id: 'VEH-004', registration: 'SP CAB-6048', name: 'Delivery Van 04', type: 'Van', capacity: 1200, driver: '', status: 'Inactive' },
];
function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(key)); return Array.isArray(saved) ? saved : fallback; }
    catch { return fallback; }
  });
  function update(next) {
    try { localStorage.setItem(key, JSON.stringify(next)); }
    catch { throw new Error('Unable to save in this browser. Check storage permissions or available space.'); }
    setValue(next);
  }
  return [value, update];
}
export function FleetProvider({ children }) {
  const [items, setItems] = useStoredState('fleetflow.demo.items', initialItems);
  const [vehicles, setVehicles] = useStoredState('fleetflow.demo.vehicles', initialVehicles);
  const [bookings, setBookings] = useStoredState('fleetflow.demo.bookings', []);
  return <FleetContext.Provider value={{ items, setItems, vehicles, setVehicles, bookings, setBookings }}>{children}</FleetContext.Provider>;
}
export function useFleet() { return useContext(FleetContext); }
