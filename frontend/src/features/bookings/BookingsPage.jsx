import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../services/api.js';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [savingId, setSavingId] = useState('');

  async function loadBookings() {
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest('/bookings');
      setBookings(response.data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBookings(); }, []);

  async function saveBooking(event) {
    event.preventDefault();
    setSavingId(editing.id);
    setError('');
    try {
      const response = await apiRequest(`/bookings/${encodeURIComponent(editing.id)}`, {
        method: 'PATCH',
        body: JSON.stringify({
          contactName: editing.contactName,
          contactPhone: editing.contactPhone,
          instructions: editing.instructions,
        }),
      });
      setBookings(current => current.map(booking => booking.id === response.data.id ? response.data : booking));
      setEditing(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingId('');
    }
  }

  async function cancelBooking(booking) {
    if (!window.confirm(`Cancel ${booking.bookingCode}?`)) return;
    setSavingId(booking.id);
    setError('');
    try {
      await apiRequest(`/bookings/${encodeURIComponent(booking.id)}`, { method: 'DELETE' });
      setBookings(current => current.filter(row => row.id !== booking.id));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingId('');
    }
  }

  return (
    <>
      <div className="page-heading">
        <div><p className="eyebrow">STORE PORTAL</p><h1>My bookings</h1><p>Review booking progress and continue approved deliveries.</p></div>
        <Link className="primary" to="/bookings/create">Create booking</Link>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {loading ? <p className="subtle" role="status">Loading bookings…</p> : (
        <section className="panel">
          {bookings.length === 0 ? <p className="subtle">No bookings yet.</p> : bookings.map(booking => (
            <article className="booking-history-row" key={booking.id}>
              <div>
                <strong>{booking.bookingCode}</strong>
                <p>{booking.deliveryDate} · {booking.deliverySlot} · {booking.totalWeight} kg</p>
                <span className="pill">{booking.status} · Review: {booking.reviewStatus}</span>
                {booking.reviewNote && <p className="subtle">Review note: {booking.reviewNote}</p>}
              </div>
              {booking.status === 'Approved' && (
                <Link to={`/handover?bookingId=${encodeURIComponent(booking.id)}`}>Continue to handover</Link>
              )}
              {booking.status === 'Completed' && (
                <Link to={`/receipt-confirmation?bookingId=${encodeURIComponent(booking.id)}`}>View receipt</Link>
              )}
              {booking.status === 'Pending Review' && <>
                <button className="secondary" type="button" disabled={savingId === booking.id} onClick={() => setEditing({
                  id: booking.id,
                  contactName: booking.contactName,
                  contactPhone: booking.contactPhone,
                  instructions: booking.instructions || '',
                })}>Edit</button>
                <button className="secondary" type="button" disabled={savingId === booking.id} onClick={() => cancelBooking(booking)}>Cancel booking</button>
              </>}
            </article>
          ))}
        </section>
      )}
      {editing && <form className="panel booking-edit-form" onSubmit={saveBooking}>
        <h2>Edit {bookings.find(booking => booking.id === editing.id)?.bookingCode}</h2>
        <label>Contact name<input required maxLength={100} value={editing.contactName} onChange={event => setEditing(current => ({ ...current, contactName: event.target.value }))} /></label>
        <label>Contact phone<input required value={editing.contactPhone} onChange={event => setEditing(current => ({ ...current, contactPhone: event.target.value }))} /></label>
        <label>Instructions<textarea maxLength={1000} value={editing.instructions} onChange={event => setEditing(current => ({ ...current, instructions: event.target.value }))} /></label>
        <div className="form-actions"><button className="secondary" type="button" onClick={() => setEditing(null)}>Discard</button><button className="primary" type="submit" disabled={savingId === editing.id}>{savingId === editing.id ? 'Saving…' : 'Save changes'}</button></div>
      </form>}
      <button className="secondary" type="button" onClick={loadBookings} disabled={loading}>Refresh</button>
    </>
  );
}
