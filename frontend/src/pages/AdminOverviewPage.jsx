import { useFleet } from '../context/FleetContext.jsx';

const activityTabs = ['All Events', 'Handovers & Receipts', 'Dispatches & Routing', 'Store Bookings'];

export default function AdminOverviewPage() {
  const { vehicles, bookings } = useFleet();
  const statusOf = record => String(record.status || '').trim().toLowerCase();
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(vehicle => statusOf(vehicle) === 'available').length;
  const inTransitVehicles = vehicles.filter(vehicle => ['in transit', 'on trip'].includes(statusOf(vehicle))).length;
  const maintenanceVehicles = vehicles.filter(vehicle => statusOf(vehicle) === 'maintenance').length;
  const activeVehicles = availableVehicles + inTransitVehicles;
  const trucks = vehicles.filter(vehicle => ['truck', 'lorry'].includes(String(vehicle.type || '').toLowerCase())).length;
  const vans = vehicles.filter(vehicle => String(vehicle.type || '').toLowerCase() === 'van').length;
  const activeBookings = bookings.filter(booking => !['cancelled', 'completed'].includes(statusOf(booking))).length;
  const draftBookings = bookings.filter(booking => statusOf(booking) === 'draft').length;
  const allocatedBookings = bookings.filter(booking => statusOf(booking) === 'allocated').length;
  const readyPercent = totalVehicles ? Math.round(availableVehicles / totalVehicles * 100) : 0;
  const activePercent = totalVehicles ? Math.round(activeVehicles / totalVehicles * 100) : 0;
  const recentAlerts = [
    ...vehicles.filter(vehicle => ['maintenance', 'inactive'].includes(statusOf(vehicle))).map(vehicle => ({
      id: `vehicle-${vehicle.id}`,
      title: statusOf(vehicle) === 'maintenance' ? 'Vehicle in maintenance' : 'Vehicle inactive',
      detail: `${vehicle.registration || vehicle.name || 'Fleet vehicle'} · ${vehicle.type || 'Vehicle'}`,
      label: statusOf(vehicle) === 'maintenance' ? 'Maintenance' : 'Inactive',
      tone: statusOf(vehicle) === 'maintenance' ? 'alert-warning' : 'alert-muted',
    })),
    ...(draftBookings ? [{
      id: 'draft-bookings',
      title: `${draftBookings} draft booking ${draftBookings === 1 ? 'request' : 'requests'}`,
      detail: 'Saved requests are awaiting the next booking workflow step.',
      label: 'Booking',
      tone: 'alert-info',
    }] : []),
  ];
  return <div className="overview-page">
    <div className="overview-heading">
      <p className="overview-eyebrow">FLEET OPERATIONS <span>›</span> LOGISTICS INTELLIGENCE &amp; OVERVIEW</p>
      <h1>Operations Overview</h1>
      <p>Real-time hub operations, vehicle fleet availability, multi-stop run tracking, and retail store handover audit.</p>
    </div>

    <section className="overview-kpis" aria-label="Fleet overview metrics">
      <article className="overview-card"><div className="overview-card-top"><span>Total Fleet Units</span><b>{totalVehicles} Total</b></div><div className="overview-value">{totalVehicles} <small>{totalVehicles === 1 ? 'vehicle' : 'vehicles'}</small></div><div className="overview-card-foot"><span>{trucks} Trucks, {vans} Vans</span><b>{readyPercent}% Ready</b></div><div className="overview-meter"><i style={{ width: `${readyPercent}%` }} /></div></article>
      <article className="overview-card"><div className="overview-card-top"><span>Active Vehicles</span><b>{activePercent}% of fleet</b></div><div className="overview-value">{activeVehicles} <small>active units</small></div><div className="overview-card-foot"><span>{availableVehicles} Available</span><b className="warning-text">{maintenanceVehicles} In Maintenance</b></div><div className="overview-meter meter-ready"><i style={{ width: `${activePercent}%` }} /></div></article>
      <article className="overview-card"><div className="overview-card-top"><span>Store Booking<br/>Requests</span><b>{activeBookings} Active</b></div><div className="overview-value">{bookings.length} <small>total requests</small></div><div className="overview-card-foot"><span>{draftBookings} Draft</span><b className="warning-text">{allocatedBookings} Allocated</b></div><small className="overview-caption">Counts reflect locally saved booking requests</small></article>
    </section>

    <section className="overview-columns">
      <div className="overview-panel activity-panel">
        <div className="overview-panel-heading"><div><h2>Activity Summary</h2><p>Live chronological feed of handovers, bookings, dispatches, and maintenance</p></div><span className="sync-badge">Live Real-Time Sync</span></div>
        <nav className="activity-tabs" aria-label="Activity categories">{activityTabs.map((tab, i) => <button className={i === 0 ? 'selected' : ''} key={tab}>{tab}{i === 0 && ' (6)'}</button>)}</nav>
        <div className="activity-list">
          <article className="activity-item"><header><div><h3>Drop Completed &amp; Handover Verified</h3><p>Nalaka Fernando · Store Manager · 09:22 AM · 42 mins ago</p></div><span className="activity-tag">Stop 1 of 3 Done</span></header><p>Driver Sunil K. delivered 650 kg (12 cartons) at Gampaha High Street (#07). Verified by Store Manager Nalaka Fernando.</p><footer><span>Ref Code: <b>TRP-402</b></span><button>Inspect Details ›</button></footer></article>
          <article className="activity-item"><header><div><h3>Multi-Stop Trip Dispatched</h3><p>Kavinda Perera · Ops Supervisor · 08:05 AM · 2 hours ago</p></div><span className="activity-tag tag-blue">Dispatched</span></header><p>TRP-402 departed Colombo Central Hub with 2,850 kg payload across 3 store drops. Vehicle: WPK-4821.</p><footer><span>Ref Code: <b>TRP-402</b></span><button>Inspect Details ›</button></footer></article>
          <article className="activity-item"><header><div><h3>Urgent Booking Request Submitted</h3><p>Kaveena De Silva · Store Manager · 08:30 AM · 1.5 hours ago</p></div><span className="activity-tag tag-urgent">Urgent Request</span></header><p>Wattala Metro Express (#23) requested 950 kg fresh farm produce due to sudden morning stock depletion.</p><footer><span>Ref Code: <b>REQ-1084</b></span><button>Inspect Details ›</button></footer></article>
          <article className="activity-item"><header><div><h3>Sequence Optimizer Adjusted Departure</h3><p>FleetFlow Algorithm · Auto-Routing Engine · 07:45 AM · 2.5 hours ago</p></div><span className="activity-tag">−22 mins ETA</span></header><p>Route sequence updated to improve delivery timing across the morning run.</p><footer><span>Ref Code: <b>TRP-398</b></span><button>Inspect Details ›</button></footer></article>
        </div>
      </div>

      <aside className="overview-side-stack">
        <section className="overview-panel runs-panel">
          <div className="overview-panel-heading"><div><h2>Active Runs &amp; Dispatch Summary</h2><p>Central hub Western Sector scheduled trips</p></div></div>
          <article className="run-card"><b className="run-code">TRP-402</b><p>Vehicle: <strong>WPK-4821</strong> (Truck)<br/>Lead Driver: Sunil Kumara<br/>Dep: 08:00 AM</p><footer>Stops: <strong>3 stores</strong> (2,850 kg)</footer></article>
          <article className="readiness-card"><h3>Depot Fleet Staging Readiness</h3><div className="overview-meter"><i style={{ width: `${activePercent}%` }} /></div><footer><span>Available: {availableVehicles} {availableVehicles === 1 ? 'unit' : 'units'}</span><span>In Transit: {inTransitVehicles} {inTransitVehicles === 1 ? 'unit' : 'units'}</span></footer></article>
        </section>
        <section className="overview-panel alerts-panel" aria-label="Recent alerts">
          <div className="overview-panel-heading"><div><h2>Recent Alerts</h2><p>Items that may need an admin's attention</p></div><span className="alert-count">{recentAlerts.length}</span></div>
          {recentAlerts.length ? <div className="alert-list">{recentAlerts.map(alert => <article className="alert-item" key={alert.id}>
            <span className={`alert-indicator ${alert.tone}`} aria-hidden="true" />
            <div className="alert-copy"><h3>{alert.title}</h3><p>{alert.detail}</p></div>
            <span className={`alert-label ${alert.tone}`}>{alert.label}</span>
          </article>)}</div> : <p className="alerts-empty">No current alerts. Fleet and booking records look clear.</p>}
        </section>
      </aside>
    </section>
  </div>;
}
