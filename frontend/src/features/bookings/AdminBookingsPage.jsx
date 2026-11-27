import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api.js';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [notes, setNotes] = useState({});
  const [error, setError] = useState('');

  async function loadBookings() {
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest('/bookings?status=Pending%20Review');
      setBookings(response.data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBookings(); }, []);

  async function review(booking, decision) {
    setSavingId(booking.id);
    setError('');
    try {
      await apiRequest(`/bookings/${encodeURIComponent(booking.id)}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ decision, ...(decision === 'reject' ? { note: notes[booking.id] || '' } : {}) }),
      });
      setBookings(current => current.filter(row => row.id !== booking.id));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingId('');
    }
  }

  return <>
    <div className="page-heading">
      <div><p className="eyebrow">OPERATIONS</p><h1>Booking review</h1><p>Approve requests or provide a reason when rejecting them.</p></div>
      <button className="secondary" type="button" onClick={loadBookings} disabled={loading}>Refresh</button>
    </div>
    {error && <p className="error" role="alert">{error}</p>}
    {loading ? <p className="subtle" role="status">Loading booking requests…</p> : bookings.length === 0 ? (
      <section className="panel"><p className="subtle">No bookings are waiting for review.</p></section>
    ) : <section className="panel">
      {bookings.map(booking => (
        <article className="booking-history-row" key={booking.id}>
          <div className="booking-review-details">
            <strong>{booking.bookingCode} · Store #{booking.storeId}</strong>
            <p>{booking.deliveryDate} · {booking.deliverySlot} · {booking.totalWeight} kg</p>
            <p>{booking.contactName} · {booking.contactPhone}</p>
            <ul>{booking.items.map(item => <li key={item.itemId}>{item.itemName}: {item.quantity} {item.unit}</li>)}</ul>
            {booking.instructions && <p>Instructions: {booking.instructions}</p>}
            <label>Rejection reason
              <textarea maxLength={500} value={notes[booking.id] || ''} onChange={event => setNotes(current => ({ ...current, [booking.id]: event.target.value }))} />
            </label>
          </div>
          <div className="booking-review-actions">
            <button className="primary" type="button" disabled={savingId === booking.id} onClick={() => review(booking, 'approve')}>Approve</button>
            <button className="secondary" type="button" disabled={savingId === booking.id || !(notes[booking.id] || '').trim()} onClick={() => review(booking, 'reject')}>Reject</button>
          </div>
        </article>
      ))}
    </section>}
  </>;
}
