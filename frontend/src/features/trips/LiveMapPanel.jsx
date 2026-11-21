import { useEffect, useMemo, useRef, useState } from 'react';
import { useFleet } from '../../context/FleetContext.jsx';

const previewCoordinates = [
  { lat: 6.9271, lng: 79.8612 },
  { lat: 6.9568, lng: 79.9195 },
  { lat: 7.0873, lng: 79.9994 },
  { lat: 6.9553, lng: 79.9122 },
];

let mapsApiPromise;
function loadGoogleMaps(apiKey) {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (mapsApiPromise) return mapsApiPromise;
  mapsApiPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async`;
    script.async = true;
    script.onload = () => window.google?.maps ? resolve(window.google.maps) : reject(new Error('Google Maps did not initialize.'));
    script.onerror = () => reject(new Error('Google Maps could not be loaded. Check the API key and network connection.'));
    document.head.appendChild(script);
  }).catch(error => { mapsApiPromise = null; throw error; });
  return mapsApiPromise;
}

function vehicleStatus(vehicle) {
  return String(vehicle.status || 'Unknown').trim();
}

export default function LiveMapPanel() {
  const { vehicles } = useFleet();
  const mapElement = useRef(null);
  const [mapState, setMapState] = useState('loading');
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const trackedVehicles = useMemo(() => vehicles
    .filter(vehicle => ['available', 'in transit', 'on trip'].includes(vehicleStatus(vehicle).toLowerCase()))
    .map((vehicle, index) => {
      const coordinates = vehicle.location || {};
      const latitude = Number(vehicle.latitude ?? coordinates.lat);
      const longitude = Number(vehicle.longitude ?? coordinates.lng);
      const hasGps = Number.isFinite(latitude) && Number.isFinite(longitude);
      const eta = vehicle.eta || vehicle.estimatedArrival || (vehicleStatus(vehicle).toLowerCase() === 'available' ? 'Staged at depot' : `~${12 + index * 8} min`);
      return {
        ...vehicle,
        eta,
        hasGps,
        position: hasGps ? { lat: latitude, lng: longitude } : previewCoordinates[index % previewCoordinates.length],
      };
    }), [vehicles]);
  const hasDemoPositions = trackedVehicles.some(vehicle => !vehicle.hasGps);

  useEffect(() => {
    let mounted = true;
    if (!apiKey) {
      setMapState('missing-key');
      return () => { mounted = false; };
    }

    setMapState('loading');
    loadGoogleMaps(apiKey).then(maps => {
      if (!mounted || !mapElement.current) return;
      const map = new maps.Map(mapElement.current, {
        center: { lat: 6.9271, lng: 79.8612 },
        zoom: 11,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
      const infoWindow = new maps.InfoWindow();
      trackedVehicles.forEach((vehicle, index) => {
        const marker = new maps.Marker({
          map,
          position: vehicle.position,
          title: `${vehicle.registration} · ETA ${vehicle.eta}`,
          label: { text: String(index + 1), color: '#fff', fontWeight: '700' },
        });
        marker.addListener('click', () => {
          const content = document.createElement('div');
          const registration = document.createElement('strong');
          registration.textContent = vehicle.registration || 'Fleet vehicle';
          const details = document.createElement('div');
          details.textContent = `${vehicle.name || vehicle.type} · ETA: ${vehicle.eta}`;
          content.append(registration, details);
          infoWindow.setContent(content);
          infoWindow.open({ map, anchor: marker });
        });
      });
      setMapState('ready');
    }).catch(() => { if (mounted) setMapState('error'); });

    return () => { mounted = false; };
  }, [apiKey, trackedVehicles]);

  return <section className="live-map-panel" aria-labelledby="live-map-title">
    <div className="live-map-heading">
      <div><h2 id="live-map-title">Live Fleet Map</h2><p>Vehicle positions and delivery arrival estimates</p></div>
      <div className="live-map-heading-meta"><span className={`map-connection ${mapState === 'ready' ? 'connected' : ''}`}><i/>{mapState === 'ready' ? 'Google Maps connected' : mapState === 'loading' ? 'Loading map' : 'Map preview'}</span><span className="map-demo-tag">{hasDemoPositions ? 'GPS preview data' : 'GPS data'}</span></div>
    </div>
    <div className="live-map-content">
      <div className={`live-map-canvas${mapState !== 'ready' ? ' map-placeholder' : ''}`}>
        {mapState === 'ready' ? <div className="google-map-element" ref={mapElement} role="application" aria-label="Google map with fleet vehicle markers"/> : <>
          <div className="map-preview-grid" aria-hidden="true"><span className="map-road road-one"/><span className="map-road road-two"/><span className="map-road road-three"/><span className="map-water"/><span className="map-area-label label-colombo">COLOMBO</span><span className="map-area-label label-kelaniya">KELANIYA</span><span className="map-area-label label-jaela">JA-ELA</span>
            {trackedVehicles.map((vehicle, index) => <span className={`map-preview-marker marker-${index % 4}`} key={vehicle.id} title={`${vehicle.registration} · ${vehicle.eta}`}><b>{index + 1}</b></span>)}
          </div>
          <div className="map-preview-message">{mapState === 'error' ? 'Google Maps could not load. Check the API key and connection.' : mapState === 'loading' ? 'Loading Google Maps…' : 'Connect a Google Maps API key to load the interactive map.'}</div>
          {!apiKey && <a className="open-google-maps" href="https://www.google.com/maps/search/?api=1&query=Colombo%2C+Sri+Lanka" target="_blank" rel="noreferrer">Open Colombo in Google Maps ↗</a>}
        </>}
      </div>
      <aside className="live-map-vehicle-list" aria-label="Tracked vehicles">
        <div className="map-list-heading"><strong>Tracked Vehicles</strong><span>{trackedVehicles.length}</span></div>
        {trackedVehicles.length ? trackedVehicles.map((vehicle, index) => <article className="map-vehicle-row" key={vehicle.id}>
          <span className="map-vehicle-number">{index + 1}</span>
          <div><strong>{vehicle.registration}</strong><small>{vehicle.name || vehicle.type} · {vehicleStatus(vehicle)}</small><small className="map-vehicle-eta">{vehicle.eta}</small></div>
        </article>) : <p className="map-empty">No available or in-transit vehicles to show.</p>}
        <p className="map-data-note">{hasDemoPositions ? 'Positions and ETAs shown without GPS fields are simulated for this preview.' : 'Vehicle positions and ETAs are read from the fleet records.'}</p>
      </aside>
    </div>
  </section>;
}
