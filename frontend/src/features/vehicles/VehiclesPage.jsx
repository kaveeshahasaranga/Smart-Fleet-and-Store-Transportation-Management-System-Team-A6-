import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFleet } from '../../context/FleetContext.jsx';
import Modal from '../../components/common/Modal.jsx';
import Icon from '../../components/common/Icon.jsx';
const statuses = ['Available', 'In transit', 'Maintenance', 'Inactive'];
const initial = { registration: '', name: '', type: 'Truck', capacity: '', driver: '', status: 'Available' };
const pageSize = 8;
const statusOf = record => record.status === 'On trip' ? 'In transit' : record.status;
const nameOf = record => record.name || `${record.type} ${record.registration}`;

export default function VehiclesPage() {
  const { vehicles, setVehicles } = useFleet();
  const [params,setParams] = useSearchParams();
  const search = params.get('q') || '';
  const [status,setStatus] = useState('All');
  const [type,setType] = useState('All');
  const [page,setPage] = useState(1);
  const [editing,setEditing] = useState(null);
  const [removing,setRemoving] = useState(null);
  const [error,setError] = useState('');
  const [notice,setNotice] = useState('');
  const [menu,setMenu] = useState(null);
  const filtered = vehicles.filter(v => (status === 'All' || statusOf(v) === status) && (type === 'All' || v.type === type) && `${v.registration} ${nameOf(v)} ${v.driver}`.toLowerCase().includes(search.toLowerCase()));
  const pages = Math.max(1,Math.ceil(filtered.length/pageSize));
  const current = Math.min(page,pages);
  const visible = filtered.slice((current-1)*pageSize,current*pageSize);
  function open(record) { setError('');setMenu(null);setEditing(record ? {...record,name:nameOf(record),status:statusOf(record)} : {...initial}); }
  function save(e) {
    e.preventDefault();
    const record = Object.fromEntries(Object.entries(editing).map(([k,v])=>[k,typeof v==='string'?v.trim():v]));
    if (!record.registration || !record.name) return setError('Registration number and vehicle name are required.');
    if (!Number.isFinite(Number(record.capacity)) || Number(record.capacity)<=0) return setError('Enter a payload capacity greater than zero.');
    if (vehicles.some(v=>v.id!==record.id && v.registration.toLowerCase()===record.registration.toLowerCase())) return setError('This registration number already exists.');
    const exists = Boolean(record.id);
    record.id ||= `VEH-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
    record.capacity = Number(record.capacity);
    try { setVehicles(exists ? vehicles.map(v=>v.id===record.id?record:v) : [...vehicles,record]); setEditing(null);setNotice(`Vehicle ${exists?'updated':'added'}. Changes saved in this browser.`); }
    catch(e) { setError(e.message); }
  }
  function remove() {
    try { setVehicles(vehicles.filter(v=>v.id!==removing.id));setRemoving(null);setNotice('Vehicle removed from this browser.'); }
    catch(e) { setError(e.message); }
  }
  function exportCsv() {
    // Quote every cell and neutralize spreadsheet formula prefixes.
    const cell = value => `"${String(value).replace(/^[=+@\-\t\r]/,"'$&").replaceAll('"','""')}"`;
    const rows = [['Registration number','Vehicle name','Type','Payload capacity (kg)','Status','Driver'],...filtered.map(v=>[v.registration,nameOf(v),v.type,v.capacity,statusOf(v),v.driver || ''])];
    const blob = new Blob(['\uFEFF'+rows.map(row=>row.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url;a.download='fleetflow-vehicles.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    setNotice(`Exported ${filtered.length} vehicles from the current filters.`);
  }
  return <div className="vehicle-registry">
    <div className="registry-heading"><div><p className="registry-eyebrow">FLEET OPERATIONS › <span>INVENTORY REGISTRY</span></p><h1>Vehicles</h1><p>Manage fleet details and vehicle availability across regional distribution hubs.</p></div><div className="registry-actions"><button className="secondary" onClick={exportCsv}><Icon name="download" size={16}/>Export CSV</button><button className="primary" onClick={()=>open()}><span className="plus">+</span> + Add vehicle</button></div></div>
    {notice && <div className="success" role="status">{notice}</div>}
    <section className="registry-filters" aria-label="Vehicle filters"><label className="registry-search"><Icon name="search"/><span className="sr-only">Search vehicles</span><input type="search" placeholder="Search by registration number or vehicle name…" value={search} onChange={e=>{setParams(e.target.value?{q:e.target.value}:{},{replace:true});setPage(1);}}/></label><label><span className="sr-only">Filter by status</span><select value={status} onChange={e=>{setStatus(e.target.value);setPage(1);}}><option value="All">Status: All statuses</option>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><label><span className="sr-only">Filter by type</span><select value={type} onChange={e=>{setType(e.target.value);setPage(1);}}><option value="All">Type: All types</option>{['Truck','Van','Lorry'].map(t=><option key={t}>{t}</option>)}</select></label><span className="registry-count">Showing {filtered.length} vehicles</span></section>
    <section className="registry-table" aria-label="Vehicle directory"><div className="table-scroll"><table><thead><tr><th>Registration number</th><th>Vehicle name</th><th>Type</th><th>Payload capacity</th><th>Status</th><th className="right">Actions</th></tr></thead><tbody>{visible.map(v=><tr key={v.id}><td><div className="registration"><span className="vehicle-icon"><Icon name={v.type==='Van'?'van':'truck'} size={17}/></span><strong>{v.registration}</strong></div></td><td>{nameOf(v)}</td><td>{v.type}</td><td className="capacity">{v.capacity.toLocaleString()} kg</td><td><span className={`registry-status ${statusOf(v).toLowerCase().replaceAll(' ','-')}`}><i/>{statusOf(v)}</span></td><td><div className="registry-row-actions"><button className="text-button" aria-label={`Edit ${v.registration}`} onClick={()=>open(v)}>Edit</button><button className="more-button" aria-label={`More actions for ${v.registration}`} aria-expanded={menu===v.id} onClick={()=>setMenu(menu===v.id?null:v.id)}>⋮</button>{menu===v.id && <div className="registry-menu"><button className="text-button danger" onClick={()=>{setError('');setRemoving(v);setMenu(null);}}>Delete vehicle</button><button className="text-button" onClick={()=>setMenu(null)}>Close</button></div>}</div></td></tr>)}</tbody></table></div>
    {!filtered.length && <div className="empty"><h3>No vehicles found</h3><p>Try another registration, name or filter.</p><button className="secondary" onClick={()=>{setParams({});setStatus('All');setType('All');setPage(1);}}>Clear filters</button></div>}
    <div className="registry-pagination"><span>Showing <b>{filtered.length ? (current-1)*pageSize+1 : 0}</b> to <b>{Math.min(current*pageSize,filtered.length)}</b> of <b>{filtered.length}</b> vehicles</span><nav aria-label="Vehicle pagination"><button disabled={current===1} onClick={()=>{setPage(current-1);setMenu(null);}}>‹ Previous</button><span aria-current="page">{current}</span><button disabled={current===pages} onClick={()=>{setPage(current+1);setMenu(null);}}>Next ›</button></nav></div></section>
    {editing && <Modal title={`${editing.id?'Edit':'Add'} vehicle`} onClose={()=>setEditing(null)}><form onSubmit={save}>{error && <p className="error" role="alert">{error}</p>}<div className="form-grid">{[{key:'registration',label:'Registration number'},{key:'name',label:'Vehicle name'},{key:'type',label:'Type',options:['Truck','Van','Lorry']},{key:'capacity',label:'Payload capacity (kg)',type:'number'},{key:'driver',label:'Assigned driver (optional)'},{key:'status',label:'Status',options:statuses}].map(f=><label key={f.key}>{f.label}{f.options?<select value={editing[f.key]} onChange={e=>setEditing({...editing,[f.key]:e.target.value})}>{f.options.map(o=><option key={o}>{o}</option>)}</select>:<input required={f.key!=='driver'} type={f.type || 'text'} min={f.type==='number'?'0.01':undefined} step={f.type==='number'?'0.01':undefined} maxLength={100} value={editing[f.key] || ''} onChange={e=>setEditing({...editing,[f.key]:e.target.value})}/>}</label>)}</div><div className="form-actions"><button type="button" className="secondary" onClick={()=>setEditing(null)}>Cancel</button><button className="primary">Save vehicle</button></div></form></Modal>}
    {removing && <Modal title="Delete vehicle?" onClose={()=>setRemoving(null)}><p>Remove <strong>{removing.registration}</strong>? This cannot be undone.</p>{error && <p className="error" role="alert">{error}</p>}<div className="form-actions"><button className="secondary" onClick={()=>setRemoving(null)}>Cancel</button><button className="delete-button" onClick={remove}>Delete vehicle</button></div></Modal>}
  </div>;
}
