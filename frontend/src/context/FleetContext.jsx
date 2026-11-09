import { createContext, useContext, useState } from 'react';
const FleetContext = createContext(null);
const initialItems = [
  { id: 'ITM-001', name: 'Rice bags', category: 'Dry goods', unit: 'bag', weight: 25, status: 'Active' },
  { id: 'ITM-002', name: 'Milk cartons', category: 'Dairy', unit: 'carton', weight: 12, status: 'Active' },
  { id: 'ITM-003', name: 'Fresh vegetables', category: 'Produce', unit: 'crate', weight: 15, status: 'Active' },
];
const initialVehicles = [
  { id: 'VEH-001', registration: 'WP LQ-4821', type: 'Truck', capacity: 3000, driver: 'Nimal Perera', status: 'Available' },
  { id: 'VEH-002', registration: 'WP CAB-2190', type: 'Van', capacity: 1000, driver: 'Kamal Silva', status: 'On trip' },
  { id: 'VEH-003', registration: 'WP LM-7315', type: 'Truck', capacity: 5000, driver: 'Sunil Fernando', status: 'Maintenance' },
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
