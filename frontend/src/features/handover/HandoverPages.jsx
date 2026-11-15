import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PortalIcon from '../../components/common/PortalIcon.jsx';
import PortalLayout from '../../components/layout/PortalLayout.jsx';
import './handover.css';

const initialItems = [
  { id: 'rice', name: 'Rice bag', detail: 'White raw / Nadu rice, 5 kg pack', category: 'Dry Grains', weight: 5, expected: 10, received: 10, accepted: 10, condition: 'Good' },
  { id: 'sugar', name: 'Sugar pack', detail: 'White crystal refined, 1 kg pack', category: 'Pantry', weight: 1, expected: 20, received: 18, accepted: 18, condition: '2 short' },
  { id: 'oil', name: 'Cooking oil carton', detail: 'Vegetable oil, 6 × 1L bottles', category: 'Oils & Liquids', weight: 6, expected: 5, received: 5, accepted: 4, condition: '1 damaged' },
];

function PageIntro({ title, subtitle, step }) {
  return (
    <div className="handover-page-intro">
      <div><span className="portal-eyebrow"><PortalIcon name="store" /> Store Portal — Inbound delivery from Kelaniya Central Hub</span><h1>{title}</h1><p>{subtitle}</p></div>
      <ol className="handover-steps" aria-label="Delivery steps">
        <li className={step > 1 ? 'complete' : 'current'}><span>✓</span> Arrival</li>
        <li className={step > 2 ? 'complete' : step === 2 ? 'current' : ''}><span>2</span> Count</li>
        <li className={step === 3 ? 'current' : ''}><span>3</span> Receipt</li>
      </ol>
    </div>
  );
}

function Panel({ title, subtitle, badge, action, children, className = '' }) {
  return (
    <section className={`portal-panel ${className}`}>
      <div className="portal-panel-heading">
        <span className="panel-accent" />
        <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
        {action}
        {badge && <span className="panel-badge">{badge}</span>}
      </div>
      {children}
    </section>
  );
}

function DeliverySummary({ receivedTotal, accepted = false, onContinue, onConfirm, confirmDisabled, receiptSaved, hasDiscrepancyNote }) {
  return (
    <aside className="summary-column">
      <section className="portal-panel summary-card">
        <div className="summary-heading"><h2>{accepted ? 'Receipt summary' : 'Handover summary'}</h2><span className={`status-pill ${accepted ? 'warning' : 'success'}`}>{accepted ? 'Not required' : 'Arrived'}</span></div>
        <dl className="summary-details">
          <div><dt>Booking</dt><dd>BK-2026-0156</dd></div><div><dt>Trip</dt><dd>TRP-418</dd></div>
          {accepted ? <><div><dt>From</dt><dd>Kelaniya Central Hub</dd></div><div><dt>To</dt><dd>Nugegoda Store (#104)</dd></div></> : <><div><dt>Vehicle</dt><dd>WP CAD-7392</dd></div><div><dt>Driver</dt><dd>Sunil Kumara</dd></div><div><dt>Arrived</dt><dd>14 Nov 2026, 10:42 AM</dd></div></>}
        </dl>
        <div className="summary-totals"><div><span>Expected:</span><strong>35 units</strong></div><div><span>{accepted ? 'Received:' : 'Counted:'}</span><strong>{receivedTotal} units</strong></div>{accepted && <div><span>Accepted:</span><strong>32 units</strong></div>}<div className="weight-total"><span>{accepted ? 'Accepted weight:' : 'Counted weight:'}</span><strong>{accepted ? '92' : '98'} kg</strong></div></div>
        {accepted ? (
          <>
            <div className="info-box"><span>ⓘ</span> Once confirmed, dispatch can see this receipt and the trip stop is marked as completed.</div>
            <button className="portal-primary summary-action" type="button" disabled={confirmDisabled || receiptSaved} onClick={onConfirm}>
              {receiptSaved ? 'Receipt confirmed ✓' : 'Confirm receipt'}
            </button>
            {!hasDiscrepancyNote && <p className="summary-hint">Add a discrepancy note before confirming.</p>}
            <Link className="summary-back-link" to="/handover"><PortalIcon name="back" /> Back to handover</Link>
          </>
        ) : (
          <>
            <div className="warning-box"><span>ⓘ</span> The count is 2 units below the manifest. You can record this on the next step.</div>
            <button className="portal-primary summary-action" type="button" onClick={onContinue}>Continue to receipt <PortalIcon name="arrow" /></button>
            <button className="summary-save-button" type="button">Save and finish later</button>
          </>
        )}
      </section>
      {!accepted && <div className="dispatch-card"><PortalIcon name="phone" /><span><strong>Central Dispatch Hub</strong><small>Hotline: +94 11 254 9900</small></span></div>}
    </aside>
  );
}

function QtyControl({ value, onChange, label }) {
  return <div className="qty-control" aria-label={`${label} quantity`}><button type="button" aria-label={`Decrease ${label}`} onClick={() => onChange(Math.max(0, value - 1))}>−</button><output>{value}</output><button type="button" aria-label={`Increase ${label}`} onClick={() => onChange(value + 1)}>+</button></div>;
}

function ItemMark({ damaged }) {
  return <span className="item-mark">{damaged ? '◫' : '♧'}</span>;
}

function HandoverItems({ items, setItems }) {
  const total = items.reduce((sum, item) => sum + item.received, 0);
  return (
    <Panel title="Count goods received" subtitle="Enter the quantity physically handed over for each item." badge="3 SKUs" className="items-panel">
      <div className="item-table item-table-handover">
        <div className="item-table-header"><span>Item description</span><span>Unit weight</span><span>Expected</span><span>Received</span><span>Status</span></div>
        {items.map((item) => {
          const difference = item.expected - item.received;
          const status = difference === 0 ? 'Match' : difference > 0 ? `${difference} short` : `${Math.abs(difference)} extra`;
          return <div className="item-row" key={item.id}>
            <div className="item-description"><ItemMark /><span><strong>{item.name}</strong><small>{item.detail}</small><em>{item.category}</em></span></div>
            <span className="table-number">{item.weight} kg</span><span className="table-number">{item.expected}</span>
            <QtyControl label={item.name} value={item.received} onChange={(received) => setItems((current) => current.map((row) => row.id === item.id ? { ...row, received } : row))} />
            <span className={`status-pill ${status === 'Match' ? 'success' : 'warning'}`}>{status}</span>
          </div>;
        })}
      </div>
      <div className="table-foot"><span>3 Item SKUs · {total} of 35 pieces received</span><strong>Counted weight: <b>98 kg</b></strong></div>
    </Panel>
  );
}

export function GoodsHandoverPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialItems);
  const receivedTotal = items.reduce((sum, item) => sum + item.received, 0);
  return <PortalLayout><PageIntro title="Goods handover" subtitle="Check the vehicle on arrival, then count the goods the driver hands over." step={2} />
    <div className="handover-grid">
      <div className="handover-main-column">
        <Panel title="Delivery details" subtitle="Trip and vehicle assigned to this delivery by central dispatch." badge="STEP 2 OF 3">
          <div className="trip-schedule">
            <div className="trip-schedule-header"><span>TRANSFER LEG &amp; SCHEDULE</span><span className="status-pill success">• Arrived</span></div>
            <div className="trip-route"><div className="route-point"><span className="route-icon">▣</span><span><small>ORIGIN</small><strong>Kelaniya Central Hub (DC-01)</strong></span></div><span className="route-arrow">→</span><div className="route-point destination"><span><small>DESTINATION</small><strong>Nugegoda (#104)</strong></span><span className="route-icon">▣</span></div></div>
            <div className="trip-meta"><span>▢ &nbsp;14 Nov 2026 | Morning (08:00 – 12:00)</span><span>♧ &nbsp;Sunil Kumara (+94 77 245 8130)</span></div>
          </div>
          <div className="verification-row"><div><span>▣</span><span><strong>Vehicle matches trip</strong><small>WP CAD-7392 · Delivery Van 02</small></span><b>✓</b></div><div><span>▣</span><span><strong>Driver identity checked</strong><small>Sunil Kumara · Lead Driver</small></span><b>✓</b></div></div>
        </Panel>
        <HandoverItems items={items} setItems={setItems} />
      </div>
      <DeliverySummary receivedTotal={receivedTotal} onContinue={() => navigate('/receipt-confirmation')} />
    </div>
  </PortalLayout>;
}

function ReceiptItems({ items }) {
  return (
    <Panel title="Items received" subtitle="Accepted units leave out anything short or damaged." badge="STEP 3 OF 3" className="receipt-items-panel">
      <div className="item-table item-table-receipt">
        <div className="item-table-header"><span>Item description</span><span>Expected</span><span>Received</span><span>Accepted</span><span>Weight</span><span>Condition</span></div>
        {items.map((item) => <div className="item-row" key={item.id}>
          <div className="item-description"><ItemMark damaged={item.condition !== 'Good'} /><span><strong>{item.name}</strong><small>{item.detail}</small><em>{item.category}</em></span></div>
          <span className="table-number">{item.expected}</span><span className={`table-number ${item.received < item.expected ? 'alert-number' : ''}`}>{item.received}</span><span className={`table-number accepted-number ${item.accepted < item.received ? 'alert-number' : ''}`}>{item.accepted}</span><span className="table-number">{item.weight * item.accepted} kg</span><span className={`status-pill ${item.condition === 'Good' ? 'success' : 'warning'}`}>{item.condition}</span>
        </div>)}
      </div>
      <div className="table-foot"><span>32 of 35 units accepted</span><strong>Accepted weight: <b>92 kg</b></strong></div>
    </Panel>
  );
}

function DiscrepancyDialog({ onClose, onSubmitted }) {
  const [selected, setSelected] = useState(['sugar', 'oil']);
  const [note, setNote] = useState('Two sugar packs were missing from the sealed crate. One cooking oil carton arrived crushed with leaking bottles and was set aside at the receiving bay.');
  const [submitted, setSubmitted] = useState(false);
  const affected = selected.reduce((total, id) => total + (id === 'sugar' ? 2 : 1), 0);
  if (submitted) {
    return <div className="dialog-backdrop" role="presentation"><section className="discrepancy-dialog submitted-dialog" role="dialog" aria-modal="true" aria-labelledby="discrepancy-title">    <div className="dialog-content"><span className="dialog-eyebrow">✓ NOTE SUBMITTED</span><h2 id="discrepancy-title">Discrepancy recorded</h2><p>Your note has been added to receipt BK-2026-0156 and is ready for dispatch to review.</p><button className="portal-primary" onClick={onClose} type="button">Done <PortalIcon name="arrow" /></button></div></section></div>;
  }
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="discrepancy-dialog" role="dialog" aria-modal="true" aria-labelledby="discrepancy-title">
        <div className="dialog-content">
          <button className="dialog-close" type="button" aria-label="Close discrepancy note" onClick={onClose}>×</button>
          <span className="dialog-eyebrow">• RECEIPT EXCEPTION</span><h2 id="discrepancy-title">Discrepancy note</h2><p className="dialog-subtitle">Tell dispatch what was wrong with this delivery.</p>
          <div className="note-reference"><span>Note reference</span><strong>DN-2026-0031</strong><span>Booking / Trip</span><strong>BK-2026-0156&nbsp; · &nbsp;TRP-418</strong></div>
          <div className="affected-heading"><strong>Affected items <span className="required">*</span></strong><span>{selected.length} of 3 items</span></div>
          <div className="affected-list">{initialItems.filter((item) => item.id !== 'rice').map((item) => {
            const checked = selected.includes(item.id);
            return <label className={`affected-item ${checked ? 'is-selected' : ''}`} key={item.id}>
              <input type="checkbox" checked={checked} onChange={() => setSelected((current) => checked ? current.filter((id) => id !== item.id) : [...current, item.id])} />
              <span className="affected-item-body"><span className="affected-item-title"><span><strong>{item.name}</strong><small>{item.weight} kg per pack</small></span><em className={`status-pill ${item.id === 'sugar' ? 'warning' : 'danger'}`}>{item.id === 'sugar' ? '• Short delivery' : '• Damaged'}</em></span>
                <span className="affected-counts"><span>EXPECTED<strong>{item.expected} units</strong></span><span>RECEIVED<strong>{item.received} units</strong></span><span>AFFECTED<strong>{item.id === 'sugar' ? '2' : '1'} unit{item.id === 'sugar' ? 's' : ''}</strong></span></span>
              </span>
            </label>;
          })}</div>
          <label className="note-label" htmlFor="discrepancy-description"><span>What happened? <span className="required">*</span></span><small>{note.length} / 500</small></label>
          <textarea id="discrepancy-description" maxLength={500} required value={note} onChange={(event) => setNote(event.target.value)} />
          <div className="evidence-heading"><span>Photo evidence</span><small>Optional</small></div>
          <label className="upload-box"><span className="upload-icon">▧</span><span><strong>Upload photos</strong><small>JPG or PNG, up to 5 MB each</small></span><input type="file" accept="image/png,image/jpeg" multiple /></label>
          <div className="dispatch-note"><strong>♧ &nbsp;Sent to dispatch</strong><span>The dispatch team can see this note as soon as it is submitted, and it stays linked to the receipt.</span></div>
        </div>
        <footer className="dialog-footer"><span>• &nbsp;{affected} units affected</span><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="portal-primary" type="button" disabled={!selected.length || !note.trim()} onClick={() => { onSubmitted(); setSubmitted(true); }}>➤ &nbsp;Submit note</button></footer>
      </section>
    </div>
  );
}

export function ReceiptConfirmationPage({ forceDiscrepancy = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [items] = useState(initialItems);
  const [showDialog, setShowDialog] = useState(forceDiscrepancy || location.pathname === '/discrepancy-note');
  const [confirmed, setConfirmed] = useState(false);
  const [noteSubmitted, setNoteSubmitted] = useState(Boolean(location.state?.noteSubmitted));
  const [receiptSaved, setReceiptSaved] = useState(false);
  const openDialog = () => setShowDialog(true);
  const closeDialog = () => { setShowDialog(false); if (location.pathname === '/discrepancy-note') navigate('/receipt-confirmation', { state: { noteSubmitted } }); };
  return <PortalLayout><PageIntro title="Receipt confirmation" subtitle="Review what was received, then confirm receipt for this delivery." step={3} />
    <div className="handover-grid receipt-grid">
      <div className="handover-main-column">
        <ReceiptItems items={items} />
        <Panel title="Discrepancies" subtitle="Differences between the manifest and the goods received." action={<button className="outline-button" type="button" onClick={openDialog}>＋ &nbsp;Add discrepancy note</button>} className="discrepancy-summary-panel">
          <div className="receipt-warning"><span>△</span><strong>3 units need a discrepancy note before you can confirm:</strong> Sugar pack (2 short) and Cooking oil carton (1 damaged).</div>
        </Panel>
        <Panel title="Receipt sign-off" subtitle="Your name and the time are recorded on the receipt." className="signoff-panel">
          <div className="signoff-fields"><label>Received by<input value="Kasun Herath (Store Staff)" readOnly /></label><label>Received at<input value="14 Nov 2026, 10:58 AM" readOnly /></label></div>
          <label className="receipt-check"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /> I confirm these goods were received at Nugegoda Store and the quantities above are correct.</label>
        </Panel>
      </div>
      <DeliverySummary
        accepted
        confirmDisabled={!confirmed || !noteSubmitted}
        hasDiscrepancyNote={noteSubmitted}
        onConfirm={() => setReceiptSaved(true)}
        receiptSaved={receiptSaved}
        receivedTotal={33}
      />
    </div>
    {showDialog && <DiscrepancyDialog onClose={closeDialog} onSubmitted={() => setNoteSubmitted(true)} />}
  </PortalLayout>;
}

export function DiscrepancyNotePage() {
  return <ReceiptConfirmationPage forceDiscrepancy />;
}
