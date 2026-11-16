import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFleet } from '../../context/FleetContext.jsx';
import Icon from '../../components/common/Icon.jsx';
import Modal from '../../components/common/Modal.jsx';
import { createTrip, listTrips } from '../../services/trips.js';

const initialRuns = [
  { id: 'TRP-402', vehicleId: 'VEH-001', departure: '08:00 AM', stops: 3, waypoints: 5, distance: 78.4, load: 2850, status: 'Scheduled', route: 'Gampaha, Negombo, Ja-Ela' },
  { id: 'TRP-403', vehicleId: 'VEH-002', departure: '11:00 AM', stops: 1, waypoints: 3, distance: 34.2, load: 420, status: 'In Transit', route: 'Colombo Fort City Central' },
];

function readSavedRuns() {
  try {
    const saved = JSON.parse(localStorage.getItem('fleetflow.demo.trips'));
    return Array.isArray(saved) ? saved : initialRuns;
  } catch { return initialRuns; }
}

function formatWeight(weight) { return `${Number(weight || 0).toLocaleString()} kg`; }

function normalizeTrip(trip) {
  const vehicle = trip.vehicle || {};
  const stops = Array.isArray(trip.stops) ? trip.stops : [];
  return {
    ...trip,
    id: trip.tripCode || trip.id,
    vehicleId: vehicle.id || trip.vehicleId,
    vehicle,
    departure: trip.departure || '—',
    stops: typeof trip.stops === 'number' ? trip.stops : stops.length,
    waypoints: trip.waypoints ?? stops.length + 2,
    distance: trip.totalDistance ?? trip.distance ?? 0,
    load: trip.totalLoad ?? trip.load ?? 0,
    route: trip.route || stops.map(stop => stop.city || stop.name).filter(Boolean).join(', ') || 'No delivery stops assigned',
    status: trip.status || 'Ready to Stage',
  };
}

export default function TripPlanningPage() {
  const { vehicles, bookings, setBookings } = useFleet();
  const [runs, setRuns] = useState(readSavedRuns);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [form, setForm] = useState({ vehicleId: '', driver: '', phone: '', departure: '08:00', returnTime: '16:30', notes: '' });
  const [error, setError] = useState('');
  const [apiMode, setApiMode] = useState('connecting');
  const [apiMessage, setApiMessage] = useState('');
  const availableVehicles = vehicles.filter(vehicle => String(vehicle.status).toLowerCase() === 'available');
  const pendingBookings = bookings.filter(booking => ['draft', 'pending', 'review'].includes(String(booking.status || '').toLowerCase()));
  const vehicle = availableVehicles.find(item => item.id === form.vehicleId) || availableVehicles[0] || null;
  const booking = pendingBookings.find(item => item.id === selectedBookingId) || null;
  const tripsWithFleet = useMemo(() => runs.map(run => ({ ...run, vehicle: run.vehicle?.registration ? run.vehicle : vehicles.find(item => item.id === run.vehicleId) })), [runs, vehicles]);

  useEffect(() => {
    let active = true;
    listTrips().then(({ trips: savedTrips = [] }) => {
      if (!active) return;
      const normalized = savedTrips.map(normalizeTrip);
      setRuns(normalized);
      try { localStorage.setItem('fleetflow.demo.trips', JSON.stringify(normalized)); } catch { /* API remains the source of truth when local cache storage is unavailable. */ }
      setApiMode('connected');
      setApiMessage('');
    }).catch(error => {
      if (!active) return;
      setApiMode('offline');
      setApiMessage(`Backend unavailable — showing browser preview data. ${error.message}`);
    });
    return () => { active = false; };
  }, []);

  function openPlanDialog(bookingId = '') {
    const firstVehicle = availableVehicles[0];
    setSelectedBookingId(bookingId);
    setForm({ vehicleId: firstVehicle?.id || '', driver: firstVehicle?.driver || '', phone: '', departure: '08:00', returnTime: '16:30', notes: '' });
    setError('');
    setShowPlanDialog(true);
  }

  function updateForm(field, value) {
    setForm(current => ({ ...current, [field]: value }));
    setError('');
  }

  function selectVehicle(id) {
    const selected = availableVehicles.find(item => item.id === id);
    setForm(current => ({ ...current, vehicleId: id, driver: selected?.driver || '' }));
    setError('');
  }

  async function createRun(event) {
    event.preventDefault();
    const assignedVehicle = availableVehicles.find(item => item.id === form.vehicleId);
    if (!assignedVehicle) return setError('Select an available vehicle for this trip.');
    if (!form.driver.trim()) return setError('Enter the lead driver name.');
    const requestedLoad = Number(booking?.totalWeight || 0);
    if (requestedLoad > Number(assignedVehicle.capacity || 0)) return setError('This vehicle payload capacity is too low for the selected booking.');

    const nextNumber = Math.max(403, ...runs.map(run => Number(String(run.id).replace(/\D/g, '')) || 0)) + 1;
    const nextRun = {
      id: `TRP-${nextNumber}`,
      vehicleId: assignedVehicle.id,
      vehicle: { id: assignedVehicle.id, registration: assignedVehicle.registration, name: assignedVehicle.name || '', type: assignedVehicle.type, capacity: Number(assignedVehicle.capacity) },
      departure: new Date(`2000-01-01T${form.departure}:00`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stops: booking ? 1 : 0,
      waypoints: booking ? 3 : 2,
      distance: 0,
      load: requestedLoad,
      status: 'Ready to Stage',
      route: booking?.destination || 'No delivery stops assigned',
      driver: form.driver.trim(),
      phone: form.phone.trim(),
      returnTime: form.returnTime,
      notes: form.notes.trim(),
      bookingIds: booking ? [booking.id] : [],
    };
    const stops = booking ? [{
      stopId: booking.id,
      bookingId: booking.id,
      name: booking.destination || 'Store booking',
      city: '',
      contact: booking.contact || '',
      load: requestedLoad,
      cartons: booking.lines?.reduce((sum, line) => sum + Number(line.quantity || 0), 0) || 0,
      notes: booking.instructions || '',
      eta: '',
      distance: 0,
      tag: 'Booking request',
      sequence: 1,
    }] : [];
    let savedRun = nextRun;
    try {
      const { trip } = await createTrip({
        tripCode: nextRun.id,
        vehicle: nextRun.vehicle,
        driver: nextRun.driver,
        driverPhone: nextRun.phone,
        departure: form.departure,
        returnTime: form.returnTime,
        notes: nextRun.notes,
        bookingIds: nextRun.bookingIds,
        stops,
        totalLoad: requestedLoad,
        totalDistance: 0,
        status: nextRun.status,
      });
      savedRun = normalizeTrip(trip);
      setApiMode('connected');
      setApiMessage('Trip saved to the backend.');
    } catch (apiError) {
      setApiMode('offline');
      setApiMessage(`Could not save to the backend; this run is only in this browser preview. ${apiError.message}`);
    }
    const nextRuns = [...runs, savedRun];
    try { localStorage.setItem('fleetflow.demo.trips', JSON.stringify(nextRuns)); }
    catch { setApiMessage('Trip created, but the browser could not store its preview copy.'); }
    setRuns(nextRuns);
    if (booking) {
      try { setBookings(bookings.map(item => item.id === booking.id ? { ...item, status: 'Allocated', allocatedTripId: savedRun.id } : item)); }
      catch { setApiMessage('Trip saved, but the booking status could not be updated in local browser storage.'); }
    }
    setShowPlanDialog(false);
  }

  return <section className="trip-planning-page" aria-labelledby="trip-planning-title">
    <div className="trip-page-tabs" aria-label="Trip tools">
      <Link className="current" to="/admin/trips"><Icon name="route" size={14}/> Trip Planning &amp; Runs <b>Active Page</b></Link>
      <Link to="/admin/trips/sequence"><Icon name="route" size={14}/> Multi-Stop Sequence Editor</Link>
      <small>Auto-Save Trip Planning</small>
    </div>

    <header className="trip-planning-header">
      <div><p className="registry-eyebrow">DISPATCH OPERATIONS › <span>TRIP PLANNING &amp; FLEET MATCHING</span></p><h1 id="trip-planning-title">Trip Planning</h1><p>Create scheduled delivery runs, allocate fleet vehicles &amp; drivers, match retail store goods orders, and monitor payload capacity.</p></div>
      <button type="button" className="primary trip-plan-new-button" onClick={() => openPlanDialog()}>+ Plan New Run</button>
    </header>
    {apiMode === 'connecting' && <div className="trip-api-message connecting" role="status">Loading trip runs from the backend…</div>}
    {apiMessage && <div className={`trip-api-message ${apiMode}`} role="status">{apiMessage}</div>}

    <section className="trip-run-configuration">
      <div className="trip-run-config-title"><span className="trip-run-id">TRP-{String(Math.max(403, ...runs.map(run => Number(String(run.id).replace(/\D/g, '')) || 0)) + 1)}</span><strong>Run Configuration &amp; Fleet Matching</strong><span className="trip-ready-badge">Status: Ready for Departure</span></div>
      <div className="trip-config-fields">
        <label>Assigned Vehicle<select value={vehicle?.id || ''} onChange={event => selectVehicle(event.target.value)} disabled={!availableVehicles.length}><option value="">Select available vehicle</option>{availableVehicles.map(item => <option value={item.id} key={item.id}>{item.registration} · {item.name || item.type}</option>)}</select></label>
        <label>Lead Driver<input value={vehicle?.driver || ''} readOnly placeholder="Choose a vehicle" /></label>
        <label>Departure Window<select defaultValue="08:00 AM – 08:30 AM"><option>08:00 AM – 08:30 AM</option><option>08:30 AM – 09:00 AM</option><option>09:00 AM – 09:30 AM</option></select></label>
      </div>
      <div className="trip-config-footer"><span>Origin Depot: <strong>Western Depot #04 (Colombo Central)</strong></span><Link to="/admin/trips/sequence">Configure Stops in Sequence Editor →</Link></div>
    </section>

    <section className="trip-runs-directory">
      <div className="trip-table-heading"><div><h2>Scheduled &amp; Active Trip Runs Directory</h2><p>Directory of regional distribution runs from Western Depot #04</p></div><span>{runs.length} Active Runs</span></div>
      <div className="trip-runs-table-scroll"><table className="trip-runs-table"><thead><tr><th>Trip Code</th><th>Vehicle &amp; Driver</th><th>Departure Window</th><th>Stops</th><th>Payload</th><th>Status</th><th></th></tr></thead><tbody>
        {tripsWithFleet.map(run => <tr key={run.id}>
          <td><strong>{run.id}</strong><small>{run.waypoints} waypoints</small></td>
          <td><strong>{run.vehicle?.registration || 'Vehicle unavailable'}</strong><small>{run.driver || run.vehicle?.driver || 'Driver not assigned'}</small></td>
          <td><strong>{run.departure}</strong><small>{run.distance ? `${run.distance} km · ~${Math.round(run.distance * .4)} min` : run.returnTime ? `Return by ${run.returnTime}` : 'Route estimate pending'}</small></td>
          <td><strong>{run.stops ? `${run.stops} ${run.stops === 1 ? 'Store' : 'Stores'}` : 'Not set'}</strong><small>{run.route}</small></td>
          <td><strong>{formatWeight(run.load)}</strong><small>{run.vehicle?.capacity ? `${Math.round(run.load / run.vehicle.capacity * 100)}% Capacity` : 'Capacity pending'}</small></td>
          <td><span className={`trip-run-status ${run.status.toLowerCase().replaceAll(' ', '-')}`}>{run.status}</span></td>
          <td><Link className="trip-view-sequence" to={`/admin/trips/sequence?run=${encodeURIComponent(run.id)}`}>View Sequence</Link></td>
        </tr>)}
        {!tripsWithFleet.length && <tr><td colSpan="7" className="trip-runs-empty">No saved trip runs yet. Plan a new run to get started.</td></tr>}
      </tbody></table></div>
    </section>

    <section className="trip-unassigned-bookings">
      <div className="trip-table-heading"><div><h2>Unassigned Store Booking Requests</h2><p>Retail store goods orders awaiting dispatch trip allocation</p></div><span>{pendingBookings.length} pending allocation</span></div>
      {pendingBookings.length ? <div className="trip-booking-cards">{pendingBookings.map(item => <article className="trip-booking-card" key={item.id}>
        <div><strong>{item.id}</strong><span className={item.urgent ? 'booking-urgency urgent' : 'booking-urgency'}>{item.urgent ? 'Urgent' : 'Draft'}</span><h3>{item.storeName || `Store #${item.requestingStore || '104'}`} → {item.destination || 'Destination not set'}</h3><p>{item.lines?.map(line => line.itemName).filter(Boolean).join(', ') || 'Goods details'} · {formatWeight(item.totalWeight)}</p></div>
        <button type="button" className="trip-allocate-button" onClick={() => openPlanDialog(item.id)}>+ Allocate to Run</button>
      </article>)}</div> : <div className="trip-bookings-empty">No unassigned store bookings. Saved booking requests will appear here when they are ready for allocation.</div>}
    </section>

    {showPlanDialog && <Modal title="Plan New Trip Run" onClose={() => setShowPlanDialog(false)}>
      <form className="plan-trip-form" onSubmit={createRun}>
        <p className="plan-trip-intro">Assign a fleet vehicle, designate a lead driver, and set departure times for the Western Corridor delivery.</p>
        <div className="plan-trip-id-row"><span>Assigned Trip ID: <strong>TRP-{String(Math.max(403, ...runs.map(run => Number(String(run.id).replace(/\D/g, '')) || 0)) + 1)}</strong></span><span className="trip-ready-badge">Status: Ready to Stage</span></div>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="plan-trip-grid">
          <label className="full">Assign Fleet Vehicle <em>*</em><select required value={form.vehicleId} onChange={event => selectVehicle(event.target.value)}><option value="">Select available vehicle</option>{availableVehicles.map(item => <option value={item.id} key={item.id}>{item.registration} · {item.name || item.type} ({item.type} – {Number(item.capacity).toLocaleString()} kg capacity)</option>)}</select></label>
          {vehicle && <div className="trip-selected-vehicle-info"><span>Category: <strong>{vehicle.type}</strong></span><span>Certified Payload: <strong>{Number(vehicle.capacity).toLocaleString()} kg</strong></span></div>}
          <label>Lead Driver <em>*</em><input required maxLength={100} value={form.driver} onChange={event => updateForm('driver', event.target.value)} placeholder="Enter driver name" /></label>
          <label>Driver Contact Phone<input type="tel" maxLength={25} value={form.phone} onChange={event => updateForm('phone', event.target.value)} placeholder="+94 77 987 6543" /></label>
          <label>Scheduled Departure Time<input required type="time" value={form.departure} onChange={event => updateForm('departure', event.target.value)} /></label>
          <label>Estimated Return Window<input required type="time" value={form.returnTime} onChange={event => updateForm('returnTime', event.target.value)} /></label>
          <label className="full">Departure Origin Terminal<input value="Western Depot #04 (Colombo Central Hub Bay 04)" readOnly /></label>
          <label className="full">Run Remarks &amp; Staging Notes <span className="optional">Optional</span><textarea rows={2} maxLength={500} value={form.notes} onChange={event => updateForm('notes', event.target.value)} placeholder="Route notes or staging requirements…" /></label>
          {booking && <div className="trip-booking-attach full"><strong>Booking attached:</strong> {booking.id} · {formatWeight(booking.totalWeight)}{booking.destination ? ` · Destination ${booking.destination}` : ''}</div>}
        </div>
        <div className="plan-trip-sync-note"><Icon name="depot" size={15}/><span>Trip details save to the API when connected. Offline preview mode keeps this run in browser storage.</span></div>
        <div className="form-actions"><button type="button" className="secondary" onClick={() => setShowPlanDialog(false)}>Cancel</button><button type="submit" className="primary">Create Run &amp; Open Planner →</button></div>
      </form>
    </Modal>}
  </section>;
}
