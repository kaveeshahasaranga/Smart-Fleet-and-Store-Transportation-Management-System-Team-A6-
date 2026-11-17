import { useState } from 'react';
import { useFleet } from '../../context/FleetContext.jsx';
import Modal from './Modal.jsx';
const configs = {
  vehicles: { title: 'Vehicle management', singular: 'vehicle', description: 'Keep your fleet organized and ready for the road.', initial: { registration: '', type: 'Truck', capacity: '', driver: '', status: 'Available' }, fields: [
    { key: 'registration', label: 'Registration number', placeholder: 'e.g. WP LQ-4821' },
    { key: 'type', label: 'Vehicle type', options: ['Truck', 'Van', 'Lorry'] },
    { key: 'capacity', label: 'Payload capacity (kg)', type: 'number' },
    { key: 'driver', label: 'Assigned driver', placeholder: 'Driver name' },
    { key: 'status', label: 'Status', options: ['Available', 'On trip', 'Maintenance'] },
  ] },
  items: { title: 'Item catalog', singular: 'item', description: 'Manage the goods your stores move every day.', initial: { name: '', category: 'Dry goods', unit: 'bag', weight: '', status: 'Active' }, fields: [
    { key: 'name', label: 'Item name', placeholder: 'e.g. Rice bags' },
    { key: 'category', label: 'Category', options: ['Dry goods', 'Dairy', 'Produce', 'Beverages', 'Household', 'Other'] },
    { key: 'unit', label: 'Unit', options: ['bag', 'carton', 'crate', 'box', 'bottle', 'piece', 'kg'] },
    { key: 'weight', label: 'Weight per unit (kg)', type: 'number' },
    { key: 'status', label: 'Status', options: ['Active', 'Inactive'] },
  ] },
};
export default function ManagementPage({ kind }) {
  const fleet = useFleet(); const config = configs[kind]; const vehicle = kind==='vehicles';
  const records = fleet[kind]; const setRecords = vehicle ? fleet.setVehicles : fleet.setItems;
  const [search,setSearch] = useState(''); const [filter,setFilter] = useState('All');
  const [editing,setEditing] = useState(null); const [removing,setRemoving] = useState(null);
  const [error,setError] = useState(''); const [notice,setNotice] = useState('');
  const statuses = config.fields.find(f=>f.key==='status').options;
  const filtered = records.filter(r => (filter==='All' || r.status===filter) && [r.name,r.registration,r.driver,r.category,r.id].some(v=>v?.toLowerCase().includes(search.toLowerCase())));
  function save(e) {
    e.preventDefault(); setError('');
    const record = Object.fromEntries(Object.entries(editing).map(([k,v])=>[k,typeof v==='string'?v.trim():v]));
    const numeric = vehicle ? 'capacity' : 'weight';
    if (!config.fields.every(f=>String(record[f.key]).trim())) return setError('Complete all required fields.');
    if (!Number.isFinite(Number(record[numeric])) || Number(record[numeric])<=0) return setError('Weight and capacity must be greater than zero.');
    const unique = vehicle ? 'registration' : 'name';
    if (records.some(r=>r.id!==record.id && r[unique].toLowerCase()===record[unique].toLowerCase())) return setError(`This ${vehicle?'registration number':'item name'} already exists.`);
    record[numeric] = Number(record[numeric]);
    const exists = Boolean(record.id); record.id ||= `${vehicle?'VEH':'ITM'}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
    try { setRecords(exists?records.map(r=>r.id===record.id?record:r):[...records,record]); setEditing(null);setNotice(`${vehicle?'Vehicle':'Item'} ${exists?'updated':'added'} in this browser.`); }
    catch(e) { setError(e.message); }
  }
  function remove() {
    if (!vehicle && fleet.bookings.some(b=>b.lines.some(l=>l.itemId===removing.id))) return setError('This item is used in a local booking draft. Set it to Inactive instead of deleting it.');
    try { setRecords(records.filter(r=>r.id!==removing.id));setRemoving(null);setNotice(`${vehicle?'Vehicle':'Item'} deleted from this browser.`); }
    catch(e) { setError(e.message); }
  }
  function open(record) { setError('');setEditing(record?{...record}:{...config.initial}); }
  return <>
    <div className="page-heading"><div><p className="eyebrow">ADMIN WORKSPACE</p><h1>{config.title}</h1><p>{config.description}</p></div><button className="primary" onClick={()=>open()}>+ Add {config.singular}</button></div>
    <div className="stat-grid"><div className="stat"><span>Total {kind}</span><strong>{records.length.toString().padStart(2,'0')}</strong><small>{vehicle?'Across your fleet':'In your catalog'}</small></div><div className="stat"><span>{statuses[0]}</span><strong className="teal">{records.filter(r=>r.status===statuses[0]).length.toString().padStart(2,'0')}</strong><small>{vehicle?'Ready for allocation':'Available for bookings'}</small></div><div className="stat"><span>{vehicle?'Total payload capacity':'Categories'}</span><strong>{vehicle?`${records.reduce((s,r)=>s+r.capacity,0).toLocaleString()} kg`:new Set(records.map(r=>r.category)).size}</strong><small>{vehicle?'All registered vehicles':'Types of goods'}</small></div></div>
    {notice && <div className="success" role="status">{notice}</div>}
    <section className="panel"><div className="section-heading"><h2><span className="heading-marker"/>{vehicle?'Fleet directory':'Catalog directory'}</h2><span className="subtle">{filtered.length} {filtered.length===1?'record':'records'}</span></div>
      <div className="toolbar"><label className="search"><span className="sr-only">Search {kind}</span><input type="search" placeholder={vehicle?'Search registration or driver…':'Search items or categories…'} value={search} onChange={e=>setSearch(e.target.value)} /></label><label className="filter"><span className="sr-only">Filter by status</span><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="All">All statuses</option>{statuses.map(s=><option key={s}>{s}</option>)}</select></label></div>
      <div className="table-scroll"><table><thead><tr><th>{vehicle?'Vehicle':'Item name'}</th><th>{vehicle?'Type':'Category'}</th><th>{vehicle?'Capacity':'Unit weight'}</th><th>{vehicle?'Driver':'Unit'}</th><th>Status</th><th className="right">Actions</th></tr></thead><tbody>{filtered.map(r=><tr key={r.id}><td><strong>{vehicle?r.registration:r.name}</strong><small>{r.id}</small></td><td>{vehicle?r.type:r.category}</td><td>{(vehicle?r.capacity:r.weight).toLocaleString()} kg</td><td>{vehicle?r.driver:r.unit}</td><td><span className={`badge ${['Available','Active'].includes(r.status)?'positive':r.status==='On trip'?'blue':'muted'}`}>{r.status}</span></td><td className="right"><div className="row-actions"><button className="text-button" aria-label={`Edit ${r.registration || r.name}`} onClick={()=>open(r)}>Edit</button><button className="text-button danger" aria-label={`Delete ${r.registration || r.name}`} onClick={()=>{setError('');setRemoving(r);}}>Delete</button></div></td></tr>)}</tbody></table></div>
      {!filtered.length && <div className="empty"><h3>{records.length?'No matching records':'Your directory is empty'}</h3><p>{records.length?'Try a different search or status filter.':`Add your first ${config.singular} to get started.`}</p>{records.length>0 && <button className="secondary" onClick={()=>{setSearch('');setFilter('All');}}>Clear filters</button>}</div>}
    </section>
    {editing && <Modal title={`${editing.id?'Edit':'Add'} ${config.singular}`} onClose={()=>setEditing(null)}><form onSubmit={save}>{error && <p className="error" role="alert">{error}</p>}<div className="form-grid">{config.fields.map(f=><label key={f.key}>{f.label} <em>*</em>{f.options?<select value={editing[f.key]} onChange={e=>setEditing({...editing,[f.key]:e.target.value})}>{f.options.map(o=><option key={o}>{o}</option>)}</select>:<input required type={f.type || 'text'} min={f.type==='number'?'0.01':undefined} step={f.type==='number'?'0.01':undefined} maxLength={f.type==='number'?undefined:100} placeholder={f.placeholder} value={editing[f.key]} onChange={e=>setEditing({...editing,[f.key]:e.target.value})} />}</label>)}</div><div className="form-actions"><button className="secondary" type="button" onClick={()=>setEditing(null)}>Cancel</button><button className="primary" type="submit">Save {config.singular}</button></div></form></Modal>}
    {removing && <Modal title={`Delete ${config.singular}?`} onClose={()=>setRemoving(null)}><p>Remove <strong>{removing.registration || removing.name}</strong> from this browser’s directory? This action cannot be undone.</p>{error && <p className="error" role="alert">{error}</p>}<div className="form-actions"><button className="secondary" onClick={()=>setRemoving(null)}>Keep {config.singular}</button><button className="delete-button" onClick={remove}>Delete {config.singular}</button></div></Modal>}
  </>;
}
