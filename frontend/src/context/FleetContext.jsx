import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { apiRequest, getApiAccessToken } from '../services/api.js';
const FleetContext = createContext(null);

function readDrafts() {
  try {
    const saved = JSON.parse(localStorage.getItem('fleetflow.demo.bookings'));
    return Array.isArray(saved) ? saved : [];
  } catch { return []; }
}

export function FleetProvider({ children }) {
  const [items, setItems] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, updateBookings] = useState(readDrafts);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState('');
  const generation = useRef(0);

  async function refreshData() {
    const request = ++generation.current;
    setLoading(true);
    setDataError('');
    const [catalog, fleet] = await Promise.allSettled([apiRequest('/items'), apiRequest('/vehicles')]);
    if (request !== generation.current) return;
    setItems(catalog.status === 'fulfilled' ? catalog.value.data : []);
    setVehicles(fleet.status === 'fulfilled' ? fleet.value.data : []);
    // Store accounts can read the active catalog without fleet administration access.
    const failures = [catalog, fleet].filter(result => result.status === 'rejected' && result.reason.status !== 403);
    if (failures.length) setDataError(failures[0].reason.message || 'Could not load fleet data.');
    setLoading(false);
  }

  useEffect(() => {
    function handleAuthChange() {
      if (getApiAccessToken()) {
        refreshData();
        return;
      }
      generation.current++;
      setItems([]);
      setVehicles([]);
      setLoading(false);
      setDataError('');
    }

    handleAuthChange();
    window.addEventListener('fleet-auth-changed', handleAuthChange);
    return () => {
      generation.current++;
      window.removeEventListener('fleet-auth-changed', handleAuthChange);
    };
  }, []);

  async function saveRecord(kind, record) {
    const fields = kind === 'vehicles'
      ? ['registration', 'name', 'type', 'capacity', 'driver', 'status', 'version']
      : ['name', 'category', 'unit', 'weight', 'status', 'version'];
    const body = Object.fromEntries(fields.filter(field => record[field] !== undefined).map(field => [field, record[field]]));
    const result = await apiRequest(`/${kind}${record.id ? '/' + record.id : ''}`, {
      method: record.id ? 'PUT' : 'POST', body: JSON.stringify(body),
    });
    const update = kind === 'vehicles' ? setVehicles : setItems;
    update(current => [...current.filter(row => row.id !== result.data.id), result.data]);
    return result.data;
  }

  async function deleteRecord(kind, record) {
    await apiRequest(`/${kind}/${record.id}`, { method: 'DELETE', body: JSON.stringify({ version: record.version }) });
    const update = kind === 'vehicles' ? setVehicles : setItems;
    update(current => current.filter(row => row.id !== record.id));
  }

  function setBookings(next) {
    localStorage.setItem('fleetflow.demo.bookings', JSON.stringify(next));
    updateBookings(next);
  }

  return <FleetContext.Provider value={{
    items, vehicles, bookings, setBookings, loading, dataError, refreshData, saveRecord, deleteRecord,
  }}>{children}</FleetContext.Provider>;
}
export function useFleet() { return useContext(FleetContext); }
