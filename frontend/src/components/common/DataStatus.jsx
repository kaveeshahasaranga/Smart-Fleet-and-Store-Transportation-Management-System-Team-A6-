import { useFleet } from '../../context/FleetContext.jsx';

export default function DataStatus() {
  const { loading, dataError, refreshData } = useFleet();
  if (loading) return <p role="status">Loading fleet and catalog data…</p>;
  if (!dataError) return null;
  return <div className="error" role="alert">{dataError} <button className="secondary" type="button" onClick={refreshData}>Retry</button></div>;
}
