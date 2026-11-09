import { useState } from 'react';
import { useFleet } from '../../context/FleetContext.jsx';
const empty = { destination: '', date: '', slot: '', contact: '', phone: '', instructions: '' };
function localDate() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export default function BookingPage() {
  const { items, bookings, setBookings } = useFleet();
  const [form, setForm] = useState(empty);
  const [lines, setLines] = useState([{ key: crypto.randomUUID(), itemId: '', quantity: 1 }]);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const activeItems = items.filter(i => i.status === 'Active');
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); }
  function updateLine(key, field, value) { setLines(lines.map(l => l.key === key ? { ...l, [field]: value } : l)); setError(''); }
  const total = lines.reduce((sum,l) => sum + (items.find(i => i.id === l.itemId)?.weight || 0) * Number(l.quantity || 0),0);
  function submit(e) {
    e.preventDefault(); setError(''); setSuccess('');
    if (form.date < localDate()) return setError('Choose today or a future delivery date.');
    if (!form.contact.trim()) return setError('Enter the contact person’s name.');
    if (!/^7\d{8}$/.test(form.phone.replace(/[\s-]/g,''))) return setError('Enter a valid mobile number: 9 digits starting with 7 after +94.');
    if (step === 1) { setStep(2); return; }
    if (!lines.length || lines.some(l => !activeItems.some(i => i.id === l.itemId) || !Number.isSafeInteger(Number(l.quantity)) || Number(l.quantity) < 1)) return setError('Select an active item and a positive whole-number quantity for every row.');
    if (new Set(lines.map(l => l.itemId)).size !== lines.length) return setError('Each item can be added once. Update its quantity instead.');
    const id = `BK-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
    try {
      setBookings([...bookings, { id, ...form, phone: '+94'+form.phone.replace(/[\s-]/g,''), requestingStore: '104', lines: lines.map(l => ({ itemId: l.itemId, quantity: Number(l.quantity), itemName: items.find(i=>i.id===l.itemId).name, unitWeight: items.find(i=>i.id===l.itemId).weight })), totalWeight: total, status: 'Draft', createdAt: new Date().toISOString() }]);
      setSuccess(`${id} saved as a local draft. It has not been sent to the transport team.`); setForm(empty); setLines([{ key: crypto.randomUUID(), itemId: '', quantity: 1 }]); setStep(1);
    } catch(e) { setError(e.message); }
  }
  return <><div className="page-heading"><div><p className="eyebrow">STORE PORTAL</p><h1>Create booking</h1><p>Plan your next delivery, all in one place.</p></div><span className="pill">Nugegoda · #104</span></div>
    <div className="steps" aria-label="Booking progress"><span className={step===1?'current':''}>1 <b>Delivery details</b></span><span className="step-line"/><span className={step===2?'current':''}>2 <b>Items & quantities</b></span></div>
    {success && <div className="success" role="status">{success}</div>}
    <form className="panel booking-panel" onSubmit={submit}>
      <div className="section-heading"><h2><span className="heading-marker"/>{step === 1 ? 'Delivery details' : 'Items & quantities'}</h2><span className="subtle">Step {step} of 2</span></div>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="form-grid" hidden={step!==1}>
        <label>Requesting store<input value="Nugegoda Store (Store #104)" disabled /></label>
        <label>Delivery destination <em>*</em><select name="destination" value={form.destination} onChange={change} required><option value="">Select destination store</option><option value="218">Maharagama Store (Store #218)</option><option value="302">Colombo Store (Store #302)</option><option value="156">Kottawa Store (Store #156)</option></select></label>
        <label>Requested delivery date <em>*</em><input type="date" name="date" min={localDate()} value={form.date} onChange={change} required /></label>
        <label>Preferred delivery slot <em>*</em><select name="slot" value={form.slot} onChange={change} required><option value="">Select a delivery slot</option><option>Morning (08:00 AM – 12:00 PM)</option><option>Afternoon (12:00 PM – 04:00 PM)</option><option>Evening (04:00 PM – 08:00 PM)</option></select></label>
        <label>Contact person <em>*</em><input name="contact" value={form.contact} onChange={change} placeholder="e.g. Saman Perera" maxLength={100} required /></label>
        <label>Contact number <em>*</em><div className="phone-input"><span>+94</span><input type="tel" name="phone" value={form.phone} onChange={change} placeholder="77 123 4567" required /></div><small>Enter 9 digits without the leading 0.</small></label>
        <label className="full">Delivery instructions <span className="optional">Optional</span><textarea name="instructions" value={form.instructions} onChange={change} rows={4} maxLength={1000} placeholder="Entrance details, loading requirements or anything we should know…" /></label>
      </div>
      {step===2 && <><div className="delivery-summary"><strong>Delivery summary</strong><span>{form.date} · {form.slot}</span><button className="text-button" type="button" onClick={()=>setStep(1)}>Edit details</button></div><p className="subtle">Choose catalog items and specify the number of units to transport.</p>
        {lines.map((line,index) => { const item = items.find(i=>i.id===line.itemId); return <div className="item-line" key={line.key}><label>Item {index+1}<select aria-label={`Item ${index+1}`} value={line.itemId} onChange={e=>updateLine(line.key,'itemId',e.target.value)} required><option value="">Select an item</option>{activeItems.map(i=><option key={i.id} value={i.id}>{i.name} · {i.weight} kg / {i.unit}</option>)}</select></label><label>Quantity {item && `(${item.unit})`}<input aria-label={`Quantity for item ${index+1}`} type="number" min="1" step="1" value={line.quantity} onChange={e=>updateLine(line.key,'quantity',e.target.value)} required /></label><div className="line-weight">{((item?.weight || 0)*Number(line.quantity || 0)).toLocaleString()} kg</div><button className="icon-button danger" type="button" aria-label={`Remove item ${index+1}`} disabled={lines.length===1} onClick={()=>setLines(lines.filter(l=>l.key!==line.key))}>×</button></div>; })}
        <button type="button" className="secondary" onClick={()=>setLines([...lines,{key:crypto.randomUUID(),itemId:'',quantity:1}])}>+ Add another item</button>
        {!activeItems.length && <p className="error">No active catalog items available. Add an item in Item Catalog first.</p>}
        <div className="total"><span>Estimated total load<small>Vehicle capacity is validated when backend allocation is connected.</small></span><strong>{total.toLocaleString()} <small>kg</small></strong></div>
      </>}
      <div className="form-actions">{step===2 && <button className="secondary" type="button" onClick={()=>setStep(1)}>← Back</button>}<button className="primary grow" type="submit">{step===1 ? 'Continue to items' : 'Save booking draft'} <span aria-hidden="true">→</span></button></div>
    </form><p className="page-note">Delivery slots shown are examples. Live availability will be checked after API integration.</p></>;
}
