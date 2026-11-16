import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../../components/common/Icon.jsx';
import Modal from '../../components/common/Modal.jsx';
import { useFleet } from '../../context/FleetContext.jsx';
import LiveMapPanel from './LiveMapPanel.jsx';
import { getTrip, updateTrip } from '../../services/trips.js';

const depot = {
  name: 'Western Depot #04 (Colombo Central Hub)',
  city: 'Colombo, Western Province',
  contact: 'Kavinda Perera · +94 71 234 9000',
  eta: '08:00 AM',
};

const stopCatalog = [
  { id: 'stop-gampaha', name: 'Gampaha High Street Store (#07)', city: 'Gampaha', contact: 'Nalaka Fernando · +94 77 123 4567', load: 650, eta: '09:15 AM', distance: 18, tag: 'Store drop-off' },
  { id: 'stop-negombo', name: 'Negombo Coastal Supercenter (#12)', city: 'Negombo', contact: 'S. Perera · +94 76 456 1234', load: 420, eta: '10:30 AM', distance: 32, tag: 'Store drop-off' },
  { id: 'stop-jaela', name: 'Ja-Ela Logistics Annex (#03)', city: 'Ja-Ela', contact: 'N. Silva · +94 71 555 0101', load: 380, eta: '11:45 AM', distance: 15, tag: 'Store drop-off' },
  { id: 'stop-kelaniya', name: 'Kelaniya City Store (#18)', city: 'Kelaniya', contact: 'R. Jayasuriya · +94 77 678 9090', load: 290, eta: '12:30 PM', distance: 12, tag: 'Store drop-off' },
  { id: 'stop-wattala', name: 'Wattala Metro Express (#23)', city: 'Wattala', contact: 'Kaveena De Silva · +94 71 333 2211', load: 510, eta: '01:15 PM', distance: 10, tag: 'Priority drop-off' },
];

const storeLocations = {
  '104': { name: 'Nugegoda Store (#104)', city: 'Nugegoda' },
  '156': { name: 'Kottawa Store (#156)', city: 'Kottawa' },
  '218': { name: 'Maharagama Store (#218)', city: 'Maharagama' },
  '302': { name: 'Colombo Store (#302)', city: 'Colombo' },
};

function formatLoad(value) { return `${Number(value || 0).toLocaleString()} kg`; }

function reorder(list, fromId, toId) {
  const from = list.findIndex(stop => stop.id === fromId);
  const to = list.findIndex(stop => stop.id === toId);
  if (from < 0 || to < 0 || from === to) return list;
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export default function TripPlannerPage() {
  const { vehicles, bookings, setBookings } = useFleet();
  const [searchParams] = useSearchParams();
  const requestedTripCode = searchParams.get('run') || 'TRP-402';
  const [stops, setStops] = useState(() => stopCatalog.slice(0, 3));
  const [activeTrip, setActiveTrip] = useState(null);
  const [apiState, setApiState] = useState('loading');
  const [apiMessage, setApiMessage] = useState('Loading trip sequence…');
  const [draggedId, setDraggedId] = useState(null);
  const [showAddStop, setShowAddStop] = useState(false);
  const [addStopForm, setAddStopForm] = useState({ bookingId: '', waypointId: '', weight: '', cartons: '', notes: '' });
  const [addStopError, setAddStopError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState(() => vehicles.find(vehicle => String(vehicle.status).toLowerCase() === 'available')?.id || '');
  const [driverOverrides, setDriverOverrides] = useState({});
  const [showDriverDialog, setShowDriverDialog] = useState(false);
  const [driverDraft, setDriverDraft] = useState('');
  const [driverError, setDriverError] = useState('');
  const availableStops = useMemo(() => stopCatalog.filter(stop => !stops.some(active => active.id === stop.id)), [stops]);
  const availableBookings = useMemo(() => bookings.filter(booking => ['draft', 'pending', 'review'].includes(String(booking.status || '').toLowerCase()) && !stops.some(stop => stop.bookingId === booking.id)), [bookings, stops]);
  const availableVehicles = vehicles.filter(vehicle => String(vehicle.status).toLowerCase() === 'available');
  const selectedVehicle = availableVehicles.find(vehicle => vehicle.id === selectedVehicleId) || availableVehicles[0] || null;
  const totalLoad = stops.reduce((sum, stop) => sum + stop.load, 0);
  const totalDistance = stops.reduce((sum, stop) => sum + stop.distance, 0);
  const currentDriver = selectedVehicle ? driverOverrides[selectedVehicle.id] ?? (selectedVehicle.driver || '') : '';
  const capacity = Number(selectedVehicle?.capacity) || 0;
  const capacityPercent = capacity ? Math.min(100, Math.round(totalLoad / capacity * 100)) : 0;
  const exceedsCapacity = capacity > 0 && totalLoad > capacity;
  const proposedLoad = totalLoad + Number(addStopForm.weight || 0);
  const proposedCapacityPercent = capacity ? Math.min(100, Math.round(proposedLoad / capacity * 100)) : 0;
  const proposedOverCapacity = capacity > 0 && proposedLoad > capacity;
  const tripCode = activeTrip?.tripCode || requestedTripCode;

  useEffect(() => {
    let active = true;
    setActiveTrip(null);
    setApiState('loading');
    setApiMessage('Loading trip sequence…');
    getTrip(requestedTripCode).then(({ trip }) => {
      if (!active) return;
      setActiveTrip(trip);
      setStops(Array.isArray(trip.stops) ? trip.stops.map(stop => ({ ...stop, id: stop.stopId, tag: stop.tag || 'Store drop-off' })) : []);
      if (trip.vehicle?.id) setSelectedVehicleId(trip.vehicle.id);
      if (trip.vehicle?.id && trip.driver && trip.driver !== vehicles.find(vehicle => vehicle.id === trip.vehicle.id)?.driver) {
        setDriverOverrides(current => ({ ...current, [trip.vehicle.id]: trip.driver }));
      }
      setApiState('connected');
      setApiMessage('Trip sequence loaded from the backend.');
    }).catch(error => {
      if (!active) return;
      const missingTrip = error.message === 'Trip not found.';
      setApiState(missingTrip ? 'connected' : 'offline');
      setApiMessage(missingTrip ? `Trip ${requestedTripCode} is not saved in the backend; showing the local sequence preview.` : `Backend unavailable — edits remain in this page preview. ${error.message}`);
      if (searchParams.get('run')) setStops([]);
    });
    return () => { active = false; };
  }, [requestedTripCode, searchParams, vehicles]);

  async function persistTripChanges(changes) {
    if (!activeTrip) {
      setApiState('offline');
      setApiMessage('No saved trip is loaded. Changes are only in this page preview.');
      return;
    }
    setApiState('saving');
    setApiMessage('Saving trip changes…');
    try {
      const { trip } = await updateTrip(tripCode, changes);
      setActiveTrip(trip);
      setApiState('connected');
      setApiMessage('Trip changes saved to the backend.');
    } catch (error) {
      setApiState('offline');
      setApiMessage(`Could not save trip changes to the backend. ${error.message}`);
    }
  }

  function persistStopList(nextStops) {
    persistTripChanges({
      stops: nextStops.map((stop, index) => ({ ...stop, stopId: stop.id, sequence: index + 1 })),
      totalLoad: nextStops.reduce((sum, stop) => sum + Number(stop.load || 0), 0),
      totalDistance: nextStops.reduce((sum, stop) => sum + Number(stop.distance || 0), 0),
      bookingIds: nextStops.map(stop => stop.bookingId).filter(Boolean),
    });
  }

  function moveStop(fromId, toId) {
    if (fromId === toId) return;
    const next = reorder(stops, fromId, toId);
    setStops(next);
    persistStopList(next);
    const position = next.findIndex(stop => stop.id === fromId) + 1;
    const moved = next.find(stop => stop.id === fromId);
    setAnnouncement(`${moved.name} moved to stop ${position}.`);
  }

  function shiftStop(index, direction) {
    const destination = index + direction;
    if (destination < 0 || destination >= stops.length) return;
    moveStop(stops[index].id, stops[destination].id);
  }

  function addStop(event) {
    event.preventDefault();
    const booking = availableBookings.find(item => item.id === addStopForm.bookingId);
    const waypoint = availableStops.find(item => item.id === addStopForm.waypointId);
    if (!booking && !waypoint) return setAddStopError('Choose a pending booking request or a retail store location.');
    const destination = booking ? (storeLocations[booking.destination] || { name: booking.destination || 'Store destination', city: '' }) : waypoint;
    const load = Number(addStopForm.weight);
    const cartons = Number(addStopForm.cartons);
    if (!Number.isFinite(load) || load <= 0) return setAddStopError('Enter a cargo weight greater than zero.');
    if (!Number.isSafeInteger(cartons) || cartons < 1) return setAddStopError('Enter at least one carton or crate.');
    if (capacity && totalLoad + load > capacity) return setAddStopError('This stop would exceed the selected vehicle’s payload capacity. Reduce the load or choose a larger vehicle.');
    const stop = {
      ...(waypoint || {}),
      id: booking ? `booking-${booking.id}` : waypoint.id,
      bookingId: booking?.id,
      name: booking ? `${destination.name} · ${booking.id}` : waypoint.name,
      city: booking ? destination.city : waypoint.city,
      contact: booking?.contact ? `Contact: ${booking.contact}` : (waypoint.contact || 'Contact to be confirmed'),
      load,
      cartons,
      notes: addStopForm.notes.trim(),
      eta: 'ETA pending',
      distance: waypoint?.distance || 10,
      tag: booking ? 'Booking request' : (waypoint.tag || 'Store drop-off'),
    };
    const nextStops = [...stops, stop];
    if (booking) {
      try { setBookings(bookings.map(item => item.id === booking.id ? { ...item, status: 'Allocated', allocatedTripId: tripCode } : item)); }
      catch (error) { return setAddStopError(error.message || 'Unable to update the booking request.'); }
    }
    setStops(nextStops);
    persistStopList(nextStops);
    setAnnouncement(`${stop.name} added as stop ${stops.length + 1}.`);
    setAddStopForm({ bookingId: '', waypointId: '', weight: '', cartons: '', notes: '' });
    setAddStopError('');
    setShowAddStop(false);
  }

  function selectBooking(id) {
    const booking = availableBookings.find(item => item.id === id);
    setAddStopForm(current => ({ ...current, bookingId: id, waypointId: '', weight: booking ? String(booking.totalWeight || '') : '', cartons: booking ? String(booking.lines?.reduce((sum, line) => sum + Number(line.quantity || 0), 0) || '') : '', notes: booking?.instructions || '' }));
    setAddStopError('');
  }

  function selectWaypoint(id) {
    const waypoint = availableStops.find(item => item.id === id);
    setAddStopForm(current => ({ ...current, waypointId: id, bookingId: '', weight: waypoint ? String(waypoint.load) : '', cartons: waypoint ? '1' : '', notes: '' }));
    setAddStopError('');
  }

  function openAddStop() {
    setAddStopForm({ bookingId: '', waypointId: '', weight: '', cartons: '', notes: '' });
    setAddStopError('');
    setShowAddStop(true);
  }

  function removeStop(stop) {
    const nextStops = stops.filter(item => item.id !== stop.id);
    setStops(nextStops);
    persistStopList(nextStops);
    if (stop.bookingId) {
      try { setBookings(bookings.map(item => item.id === stop.bookingId ? { ...item, status: 'Draft', allocatedTripId: '' } : item)); }
      catch { setApiMessage('Stop removed, but its booking status could not be updated in browser storage.'); }
    }
    setAnnouncement(`${stop.name} removed from the sequence.`);
  }

  function openDriverDialog() {
    setDriverDraft(currentDriver);
    setDriverError('');
    setShowDriverDialog(true);
  }

  function saveDriverOverride(event) {
    event.preventDefault();
    const driver = driverDraft.trim();
    if (!driver) return setDriverError('Enter the driver assigned to this trip.');
    setDriverOverrides(current => ({ ...current, [selectedVehicle.id]: driver }));
    persistTripChanges({ driver });
    setShowDriverDialog(false);
  }

  function selectTripVehicle(id) {
    const vehicle = availableVehicles.find(item => item.id === id);
    setSelectedVehicleId(id);
    if (vehicle) persistTripChanges({ vehicle: { id: vehicle.id, registration: vehicle.registration, name: vehicle.name || '', type: vehicle.type, capacity: Number(vehicle.capacity) }, driver: driverOverrides[vehicle.id] || vehicle.driver || '' });
  }

  return <section className="trip-planner-page" aria-labelledby="trip-planner-title">
    <div className="trip-page-tabs" aria-label="Trip tools">
      <Link to="/admin/trips"><Icon name="route" size={14}/> Trip Planning &amp; Runs</Link>
      <Link className="current" to="/admin/trips/sequence"><Icon name="route" size={14}/> Multi-Stop Sequence Editor <b>Active Page</b></Link>
      <small>Auto-Save Trip Planning</small>
    </div>

    <div className="trip-planner-heading">
      <div>
        <p className="registry-eyebrow">ROUTE OPTIMIZATION › <span>MULTI-STOP SEQUENCE EDITOR</span></p>
        <h1 id="trip-planner-title">Multi-Stop Sequence Editor</h1>
        <p>Reorder delivery drops, monitor vehicle payload limits, track drop-off details, and dispatch the run.</p>
      </div>
    </div>
    <div className={`trip-api-message ${apiState}`} role="status">{apiMessage}</div>

    <section className="trip-summary-grid" aria-label="Trip summary">
      <article><span>Run ID</span><strong>{tripCode}</strong><small>{activeTrip?.status || 'Sequence preview'}</small></article>
      <article><span>Vehicle Assigned</span><strong>{selectedVehicle?.registration || 'Not assigned'}</strong><small>{selectedVehicle?.name || 'Select an available vehicle'}</small></article>
      <article><span>Store Drops</span><strong>{stops.length} Stops</strong><small>{stops.length} delivery destinations</small></article>
      <article><span>Route Estimate</span><strong>~{totalDistance} km</strong><small>{totalLoad.toLocaleString()} kg total load</small></article>
    </section>

    <section className="trip-allocation-panel" aria-labelledby="trip-allocation-title">
      <div className="trip-allocation-heading"><div><h2 id="trip-allocation-title">Vehicle Allocation</h2><p>Select an available vehicle and review its assigned driver and payload capacity.</p></div><span className={`trip-capacity-status${exceedsCapacity ? ' over-capacity' : ''}`}>{exceedsCapacity ? 'Over capacity' : selectedVehicle ? 'Capacity checked' : 'Vehicle required'}</span></div>
      <div className="trip-allocation-grid">
        <label className="trip-vehicle-select">Available vehicle
          <select value={selectedVehicle?.id || ''} onChange={event => selectTripVehicle(event.target.value)} disabled={!availableVehicles.length}>
            {!availableVehicles.length && <option value="">No available vehicles</option>}
            {availableVehicles.map(vehicle => <option key={vehicle.id} value={vehicle.id}>{vehicle.registration} · {vehicle.name || vehicle.type}</option>)}
          </select>
        </label>
        {selectedVehicle ? <>
          <div className="trip-driver-summary"><span>Assigned driver</span><strong>{currentDriver || 'No driver assigned'}</strong>{driverOverrides[selectedVehicle.id] && <small>Trip override</small>}</div>
          <button type="button" className="secondary trip-driver-override" onClick={openDriverDialog} disabled={!selectedVehicle}>Override driver</button>
          <div className="trip-capacity-meter"><div><span>Payload capacity</span><strong>{totalLoad.toLocaleString()} / {capacity.toLocaleString()} kg</strong></div><div className="trip-capacity-track"><i className={exceedsCapacity ? 'over-capacity' : ''} style={{ width: `${capacityPercent}%` }}/></div><small>{capacity ? `${capacityPercent}% of vehicle capacity` : 'Capacity not recorded'}{exceedsCapacity ? ' · Reduce trip load or select another vehicle.' : ''}</small></div>
        </> : <p className="trip-no-vehicle">No available vehicles are currently listed. Add or update a vehicle in the fleet registry to allocate this trip.</p>}
      </div>
    </section>

    <LiveMapPanel />

    <section className="trip-sequence-panel" aria-labelledby="trip-sequence-title">
      <div className="trip-sequence-heading">
        <div><h2 id="trip-sequence-title">Stop-by-Stop Waypoint Sequence</h2><p>Drag a delivery stop to reorder the run, or use the move controls.</p></div>
        <button className="trip-add-stop-button" type="button" onClick={openAddStop} disabled={!availableStops.length && !availableBookings.length}>
          <span aria-hidden="true">+</span> Add Stop to Sequence
        </button>
      </div>

      <ol className="trip-stop-list" aria-label="Delivery stop sequence">
        <li className="trip-stop depot-stop">
          <span className="trip-stop-index depot-index"><Icon name="depot" size={15}/></span>
          <div className="trip-stop-main"><div className="trip-stop-title"><strong>{depot.name}</strong><span className="trip-stop-tag depot-tag">Origin / Final Return</span></div><p>{depot.city} <span>·</span> Contact: {depot.contact}</p></div>
          <div className="trip-stop-meta"><span>Start &amp; end</span><strong>{depot.eta}</strong></div>
          <span className="trip-stop-fixed">FIXED</span>
        </li>

        {stops.map((stop, index) => <li
          className={`trip-stop delivery-stop${draggedId === stop.id ? ' is-dragging' : ''}`}
          key={stop.id}
          draggable
          onDragStart={event => { setDraggedId(stop.id); event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', stop.id); }}
          onDragEnd={() => setDraggedId(null)}
          onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }}
          onDrop={event => { event.preventDefault(); moveStop(event.dataTransfer.getData('text/plain') || draggedId, stop.id); setDraggedId(null); }}
        >
          <span className="trip-stop-index">{index + 1}</span>
          <div className="trip-stop-main"><div className="trip-stop-title"><strong>{stop.name}</strong><span className={`trip-stop-tag${stop.tag.includes('Priority') ? ' priority-tag' : ''}`}>{stop.tag}</span></div><p>{stop.city} <span>·</span> {stop.contact}{stop.notes ? ` · ${stop.notes}` : ''}</p></div>
          <div className="trip-stop-meta"><span>{stop.load} kg{stop.cartons ? ` · ${stop.cartons} cartons` : ''}</span><strong>{stop.eta}</strong></div>
          <div className="trip-stop-actions">
            <button type="button" aria-label={`Move ${stop.name} up`} title="Move up" onClick={() => shiftStop(index, -1)} disabled={index === 0}>↑</button>
            <button type="button" aria-label={`Move ${stop.name} down`} title="Move down" onClick={() => shiftStop(index, 1)} disabled={index === stops.length - 1}>↓</button>
            <button type="button" aria-label={`Remove ${stop.name}`} title="Remove stop" onClick={() => removeStop(stop)}>×</button>
          </div>
          <span className="trip-drag-handle" aria-hidden="true">⠿⠿</span>
        </li>)}

        <li className="trip-stop return-stop">
          <span className="trip-stop-index return-index">↩</span>
          <div className="trip-stop-main"><div className="trip-stop-title"><strong>Return to Western Depot #04</strong><span className="trip-stop-tag return-tag">Return Point</span></div><p>Colombo Central Hub <span>·</span> Sequence completes at origin depot</p></div>
          <div className="trip-stop-meta"><span>{totalLoad.toLocaleString()} kg delivered</span><strong>End of run</strong></div>
          <span className="trip-stop-fixed">FIXED</span>
        </li>
      </ol>

      <div className="trip-sequence-footer"><span><span className="trip-lock" aria-hidden="true">●</span> Depot origin and return remain fixed. Delivery stops can be reordered.</span><span>{stops.length} delivery {stops.length === 1 ? 'stop' : 'stops'} · {totalLoad.toLocaleString()} kg payload</span></div>
      <p className="sr-only" aria-live="polite">{announcement}</p>
    </section>

    {showAddStop && <Modal title="Add Stop to Delivery Sequence" onClose={() => setShowAddStop(false)}>
      <form className="trip-add-stop-dialog-form" onSubmit={addStop}>
        <p className="trip-add-stop-intro">Insert an intermediate retail store drop into active run <strong>{tripCode}</strong> ({selectedVehicle?.registration || 'vehicle not assigned'}).</p>
        {addStopError && <p className="error" role="alert">{addStopError}</p>}
        <label className="full">Option A: From pending goods request <span className="trip-modal-recommended">Recommended</span>
          <select value={addStopForm.bookingId} onChange={event => selectBooking(event.target.value)}>
            <option value="">— Choose Store Booking Request —</option>
            {availableBookings.map(booking => <option key={booking.id} value={booking.id}>{booking.id} · {storeLocations[booking.destination]?.name || booking.destination || 'Store request'} · {formatLoad(booking.totalWeight)}</option>)}
          </select>
        </label>
        <div className="trip-add-stop-divider"><span>OR OPTION B: CUSTOM STORE WAYPOINT</span></div>
        <label className="full">Select retail store location <em>*</em>
          <select value={addStopForm.waypointId} onChange={event => selectWaypoint(event.target.value)}>
            <option value="">Choose an available store waypoint</option>
            {availableStops.map(stop => <option key={stop.id} value={stop.id}>{stop.name}</option>)}
          </select>
        </label>
        <div className="trip-add-stop-fields">
          <label>Cargo weight (kg) <em>*</em><input type="number" min="1" step="1" value={addStopForm.weight} onChange={event => { setAddStopForm(current => ({ ...current, weight: event.target.value })); setAddStopError(''); }} required /></label>
          <label>Cartons / crates <em>*</em><input type="number" min="1" step="1" value={addStopForm.cartons} onChange={event => { setAddStopForm(current => ({ ...current, cartons: event.target.value })); setAddStopError(''); }} required /></label>
        </div>
        <label className="full">Special handling / delivery notes <span className="optional">Optional</span><input maxLength={200} value={addStopForm.notes} onChange={event => setAddStopForm(current => ({ ...current, notes: event.target.value }))} placeholder="e.g. Offload via rear dock bay 02; fragile crates" /></label>
        <div className={`trip-add-stop-capacity${proposedOverCapacity ? ' over-capacity' : ''}`}>
          <div><span>Vehicle payload capacity check</span><b>{proposedOverCapacity ? 'Over Capacity' : capacity ? `${proposedCapacityPercent}% Capacity` : 'Select Vehicle'}</b></div>
          <p>{selectedVehicle?.registration || 'No vehicle assigned'} Load after stop: <strong>{proposedLoad.toLocaleString()} / {capacity ? `${capacity.toLocaleString()} kg` : '—'}</strong></p>
          <div className="trip-capacity-track"><i className={proposedOverCapacity ? 'over-capacity' : ''} style={{ width: `${proposedCapacityPercent}%` }}/></div>
          <small>{capacity && !proposedOverCapacity ? `${(capacity - proposedLoad).toLocaleString()} kg remaining` : proposedOverCapacity ? `${(proposedLoad - capacity).toLocaleString()} kg over capacity` : 'Choose an available vehicle to check load.'}</small>
        </div>
        <div className="form-actions"><button type="button" className="secondary" onClick={() => setShowAddStop(false)}>Cancel</button><button type="submit" className="primary" disabled={!selectedVehicle || proposedOverCapacity}>Insert Stop into Sequence →</button></div>
      </form>
    </Modal>}

    {showDriverDialog && selectedVehicle && <Modal title="Override assigned driver" onClose={() => setShowDriverDialog(false)}>
      <form className="trip-driver-form" onSubmit={saveDriverOverride}>
        <p className="subtle">Set the driver for <strong>{selectedVehicle.registration}</strong> on this trip. This override does not change the vehicle’s fleet record.</p>
        {driverError && <p className="error" role="alert">{driverError}</p>}
        <label>Driver name<input autoFocus value={driverDraft} onChange={event => { setDriverDraft(event.target.value); setDriverError(''); }} maxLength={100} placeholder="Enter driver name" /></label>
        <div className="form-actions"><button type="button" className="secondary" onClick={() => setShowDriverDialog(false)}>Cancel</button><button type="submit" className="primary">Save trip override</button></div>
      </form>
    </Modal>}
  </section>;
}
