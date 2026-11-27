import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import PortalIcon from '../../components/common/PortalIcon.jsx';
import PortalLayout from '../../components/layout/PortalLayout.jsx';
import { apiRequest } from '../../services/api.js';
import './handover.css';

function PageIntro({ title, subtitle, step }) {
  return (
    <div className="handover-page-intro">
      <div><span className="portal-eyebrow"><PortalIcon name="store" /> Store Portal · Booking goods workflow</span><h1>{title}</h1><p>{subtitle}</p></div>
      <ol className="handover-steps" aria-label="Delivery steps">
        <li className={step > 1 ? 'complete' : 'current'}><span>✓</span> Arrival</li>
        <li className={step > 2 ? 'complete' : step === 2 ? 'current' : ''}><span>2</span> Count</li>
        <li className={step === 3 ? 'current' : ''}><span>3</span> Receipt</li>
      </ol>
    </div>
  );
}

function Panel({ title, subtitle, badge, children, className = '' }) {
  return (
    <section className={`portal-panel ${className}`}>
      <div className="portal-panel-heading">
        <span className="panel-accent" />
        <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
        {badge && <span className="panel-badge">{badge}</span>}
      </div>
      {children}
    </section>
  );
}

function useBooking(bookingId) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setBooking(null);
    setError('');
    if (!bookingId) {
      setError('Choose an approved booking from My bookings to continue.');
      setLoading(false);
      return () => { active = false; };
    }

    setLoading(true);
    apiRequest(`/bookings/${encodeURIComponent(bookingId)}/handover`)
      .then(response => { if (active) setBooking(response.data); })
      .catch(requestError => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [bookingId]);

  return { booking, setBooking, loading, error, setError };
}

function StatusMessage({ loading, error }) {
  if (loading) return <p role="status">Loading booking…</p>;
  if (error) return <div className="error" role="alert">{error} <Link to="/bookings">Return to My bookings</Link></div>;
  return null;
}

function ItemMark() {
  return <span className="item-mark">♧</span>;
}

function BookingItems({ items, values, onChange, readOnly = false }) {
  return (
    <div className="item-table item-table-handover">
      <div className="item-table-header"><span>Item description</span><span>Unit weight</span><span>Expected</span><span>Received</span><span>Accepted</span></div>
      {items.map(item => {
        const row = values.find(value => value.itemId === item.itemId);
        const received = row?.receivedQuantity ?? item.quantity;
        const accepted = row?.acceptedQuantity ?? received;
        return (
          <div className="item-row" key={item.itemId}>
            <div className="item-description"><ItemMark /><span><strong>{item.itemName}</strong><small>{item.unit}</small></span></div>
            <span className="table-number">{item.unitWeight} kg</span>
            <span className="table-number">{item.quantity}</span>
            <label className="handover-quantity">Received
              <input aria-label={`Received ${item.itemName}`} type="number" min="0" step={item.unit === 'kg' ? '0.001' : '1'} value={received} disabled={readOnly} onChange={event => onChange(item.itemId, 'receivedQuantity', event.target.value)} />
            </label>
            <label className="handover-quantity">Accepted
              <input aria-label={`Accepted ${item.itemName}`} type="number" min="0" step={item.unit === 'kg' ? '0.001' : '1'} value={accepted} disabled={readOnly} onChange={event => onChange(item.itemId, 'acceptedQuantity', event.target.value)} />
            </label>
          </div>
        );
      })}
    </div>
  );
}

function BookingSummary({ booking, values, accepted = false, onContinue, onConfirm, confirmDisabled, receiptSaved }) {
  const counted = values.reduce((total, row) => total + Number(row.receivedQuantity || 0), 0);
  const acceptedCount = values.reduce((total, row) => total + Number(row.acceptedQuantity || 0), 0);
  return (
    <aside className="summary-column">
      <section className="portal-panel summary-card">
        <div className="summary-heading"><h2>{accepted ? 'Receipt summary' : 'Handover summary'}</h2><span className={`status-pill ${accepted ? 'warning' : 'success'}`}>{booking.status}</span></div>
        <dl className="summary-details">
          <div><dt>Booking</dt><dd>{booking.bookingCode}</dd></div>
          <div><dt>Delivery date</dt><dd>{booking.deliveryDate}</dd></div>
          <div><dt>Destination</dt><dd>Store #{booking.destinationStoreId}</dd></div>
          <div><dt>Contact</dt><dd>{booking.contactName}</dd></div>
        </dl>
        <div className="summary-totals">
          <div><span>Expected:</span><strong>{booking.items.reduce((sum, item) => sum + item.quantity, 0)} items</strong></div>
          <div><span>{accepted ? 'Received:' : 'Counted:'}</span><strong>{counted}</strong></div>
          {accepted && <div><span>Accepted:</span><strong>{acceptedCount}</strong></div>}
          <div className="weight-total"><span>Total weight:</span><strong>{booking.totalWeight} kg</strong></div>
        </div>
        {accepted
          ? <button className="portal-primary summary-action" type="button" disabled={confirmDisabled || receiptSaved} onClick={onConfirm}>{receiptSaved ? 'Receipt confirmed ✓' : 'Confirm receipt'}</button>
          : <button className="portal-primary summary-action" type="button" onClick={onContinue}>Continue to receipt <PortalIcon name="arrow" /></button>}
      </section>
    </aside>
  );
}

function defaultReceiptItems(booking) {
  return booking.items.map(item => ({
    itemId: item.itemId,
    receivedQuantity: item.quantity,
    acceptedQuantity: item.quantity,
  }));
}

export function GoodsHandoverPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const navigate = useNavigate();
  const { booking, loading, error } = useBooking(bookingId);
  const [values, setValues] = useState([]);
  useEffect(() => { if (booking) setValues(defaultReceiptItems(booking)); }, [booking]);

  function changeItem(itemId, field, value) {
    setValues(current => current.map(row => row.itemId === itemId ? { ...row, [field]: value === '' ? '' : Number(value) } : row));
  }

  if (loading || error) return <PortalLayout><PageIntro title="Goods handover" subtitle="Record the quantities physically received for this approved booking." step={2} /><StatusMessage loading={loading} error={error} /></PortalLayout>;
  if (!booking) return null;

  return <PortalLayout>
    <PageIntro title="Goods handover" subtitle="Record the quantities physically received for this approved booking." step={2} />
    <div className="handover-grid">
      <div className="handover-main-column">
        <Panel title="Delivery details" subtitle={`${booking.deliveryDate} · ${booking.deliverySlot}`} badge={booking.bookingCode}>
          <p>Contact: {booking.contactName} · {booking.contactPhone}</p>
          {booking.instructions && <p>Instructions: {booking.instructions}</p>}
        </Panel>
        <Panel title="Count goods received" subtitle="Record both received and accepted quantities." badge={`${booking.items.length} items`} className="items-panel">
          <BookingItems items={booking.items} values={values} onChange={changeItem} />
        </Panel>
      </div>
      <BookingSummary booking={booking} values={values} onContinue={() => navigate(`/receipt-confirmation?bookingId=${encodeURIComponent(booking.id)}`, { state: { receiptItems: values } })} />
    </div>
  </PortalLayout>;
}

export function ReceiptConfirmationPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const { booking, setBooking, loading, error, setError } = useBooking(bookingId);
  const [values, setValues] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [discrepancyNote, setDiscrepancyNote] = useState('');
  const [saving, setSaving] = useState(false);
  const isComplete = booking?.status === 'Completed';

  useEffect(() => {
    if (!booking) return;
    const savedItems = booking.goodsConfirmation?.items;
    setValues(location.state?.receiptItems || (savedItems
      ? savedItems.map(item => ({ itemId: item.itemId, receivedQuantity: item.receivedQuantity, acceptedQuantity: item.acceptedQuantity }))
      : defaultReceiptItems(booking)));
    setDiscrepancyNote(booking.goodsConfirmation?.discrepancyNote || '');
  }, [booking, location.state]);

  const hasDiscrepancy = useMemo(() => booking?.items.some(item => {
    const row = values.find(value => value.itemId === item.itemId);
    return row && (Number(row.receivedQuantity) !== item.quantity || Number(row.acceptedQuantity) !== Number(row.receivedQuantity));
  }) ?? false, [booking, values]);

  function changeItem(itemId, field, value) {
    setValues(current => current.map(row => row.itemId === itemId ? { ...row, [field]: value === '' ? '' : Number(value) } : row));
  }

  async function submitReceipt() {
    setError('');
    setSaving(true);
    try {
      const response = await apiRequest(`/bookings/${encodeURIComponent(booking.id)}/goods-confirmation`, {
        method: 'POST',
        body: JSON.stringify({ items: values, discrepancyNote }),
      });
      setBooking(response.data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading || error && !booking) return <PortalLayout><PageIntro title="Receipt confirmation" subtitle="Review the goods received for this booking." step={3} /><StatusMessage loading={loading} error={error} /></PortalLayout>;
  if (!booking) return null;

  return <PortalLayout>
    <PageIntro title="Receipt confirmation" subtitle="Review the goods received, then confirm the booking receipt." step={3} />
    <div className="handover-grid receipt-grid">
      <div className="handover-main-column">
        <Panel title="Items received" subtitle="Adjust received and accepted quantities before confirming." badge={booking.bookingCode} className="receipt-items-panel">
          <BookingItems items={booking.items} values={values} onChange={changeItem} readOnly={isComplete} />
        </Panel>
        {hasDiscrepancy && <Panel title="Discrepancy note" subtitle="A note is required when the received or accepted quantities differ from the booking.">
          <label className="note-label" htmlFor="discrepancy-description">Describe what happened</label>
          <textarea id="discrepancy-description" maxLength={500} value={discrepancyNote} disabled={isComplete} onChange={event => setDiscrepancyNote(event.target.value)} />
        </Panel>}
        <Panel title="Receipt sign-off" subtitle="Your confirmation is saved against this booking.">
          {isComplete
            ? <p className="success" role="status">Receipt confirmed{booking.goodsConfirmation?.confirmedAt ? ` at ${new Date(booking.goodsConfirmation.confirmedAt).toLocaleString()}` : ''}.</p>
            : <label className="receipt-check"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} /> I confirm these quantities are correct.</label>}
          {error && <p className="error" role="alert">{error}</p>}
          <Link className="summary-back-link" to={`/handover?bookingId=${encodeURIComponent(booking.id)}`} state={{ receiptItems: values }}>Back to handover</Link>
        </Panel>
      </div>
      <BookingSummary booking={booking} values={values} accepted onConfirm={submitReceipt} confirmDisabled={!confirmed || (hasDiscrepancy && !discrepancyNote.trim()) || saving || isComplete} receiptSaved={isComplete} />
    </div>
  </PortalLayout>;
}

export function DiscrepancyNotePage() {
  return <ReceiptConfirmationPage />;
}
