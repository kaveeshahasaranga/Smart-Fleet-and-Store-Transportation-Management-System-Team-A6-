import { useFleet } from '../../context/FleetContext.jsx';

const storeNames = {
  '104': 'Nugegoda Store (#104)',
  '218': 'Maharagama Store (#218)',
  '302': 'Colombo Store (#302)',
  '156': 'Kottawa Store (#156)',
};

function formatDate(value) {
  if (!value) return '—';
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(parsed);
}

function formatSubmitted(value) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(parsed);
}

export default function AdminBookingReviewQueue() {
  const { bookings } = useFleet();
  const reviewQueue = [...bookings]
    .filter(booking => !['completed', 'cancelled'].includes(String(booking.status || '').toLowerCase()))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return <section className="booking-review-page" aria-labelledby="booking-review-title">
    <div className="booking-review-heading">
      <div>
        <p className="registry-eyebrow">FLEET OPERATIONS › <span>BOOKING REVIEW</span></p>
        <h1 id="booking-review-title">Booking Review Queue</h1>
        <p>Review the booking requests saved by the store portal.</p>
      </div>
      <span className="booking-queue-count">{reviewQueue.length} {reviewQueue.length === 1 ? 'request' : 'requests'}</span>
    </div>

    <div className="booking-review-note" role="note">This preview reads locally saved booking drafts. Requests are not sent to an admin service.</div>

    <section className="booking-review-table" aria-label="Booking requests">
      {reviewQueue.length ? <div className="table-scroll"><table>
        <thead><tr><th>Request</th><th>Requesting store</th><th>Destination</th><th>Delivery date</th><th>Load</th><th>Status</th><th>Submitted</th></tr></thead>
        <tbody>{reviewQueue.map(booking => <tr key={booking.id}>
          <td><strong className="booking-review-id">{booking.id}</strong><small>{booking.contact || 'No contact provided'}</small></td>
          <td>{storeNames[booking.requestingStore] || `Store #${booking.requestingStore || '—'}`}</td>
          <td>{storeNames[booking.destination] || booking.destination || '—'}</td>
          <td>{formatDate(booking.date)}</td>
          <td>{Number(booking.totalWeight || 0).toLocaleString()} kg<small>{booking.lines?.length || 0} {booking.lines?.length === 1 ? 'item' : 'items'}</small></td>
          <td><span className="booking-review-status">{booking.status || 'Draft'}</span></td>
          <td>{formatSubmitted(booking.createdAt)}</td>
        </tr>)}</tbody>
      </table></div> : <div className="booking-review-empty"><h2>No booking requests yet</h2><p>Requests saved from the store portal will appear here.</p></div>}
    </section>
  </section>;
}
