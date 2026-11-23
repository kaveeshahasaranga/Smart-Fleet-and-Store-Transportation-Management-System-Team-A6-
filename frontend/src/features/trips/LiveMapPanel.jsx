import { useEffect, useMemo, useRef, useState } from 'react';
import { useFleet } from '../../context/FleetContext.jsx';
import { listVehicleLocations, subscribeVehicleLocationStream } from '../../services/tracking.js';

const previewCoordinates = [
  { lat: 6.9271, lng: 79.8612 },
  { lat: 6.9568, lng: 79.9195 },
  { lat: 7.0873, lng: 79.9994 },
  { lat: 6.9553, lng: 79.9122 },
];
const trackingPollMs = 10000;

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

function formatLocationTime(value) {
  if (!value) return 'GPS live';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'GPS live' : `GPS updated ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export default function LiveMapPanel() {
  const { vehicles } = useFleet();
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const markersRef = useRef(new Map());
  const [mapState, setMapState] = useState('loading');
  const [trackingState, setTrackingState] = useState('loading');
  const [socketConnected, setSocketConnected] = useState(false);
  const [gpsLocations, setGpsLocations] = useState([]);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    let mounted = true;
    let timer;
    async function refreshLocations() {
      try {
        const { locations = [] } = await listVehicleLocations();
        if (!mounted) return;
        setGpsLocations(locations);
        setTrackingState('connected');
      } catch {
        if (!mounted) return;
        setTrackingState('offline');
      } finally {
        if (mounted) timer = window.setTimeout(refreshLocations, trackingPollMs);
      }
    }
    refreshLocations();
    return () => { mounted = false; window.clearTimeout(timer); };
  }, []);

  useEffect(() => subscribeVehicleLocationStream({
    onConnection: setSocketConnected,
    onLocation: location => {
      setGpsLocations(current => {
        const existing = current.find(item => item.vehicleId === location.vehicleId);
        if (existing && new Date(existing.recordedAt) > new Date(location.recordedAt)) return current;
        return existing
          ? current.map(item => item.vehicleId === location.vehicleId ? location : item)
          : [...current, location];
      });
    },
  }), []);

  const trackedVehicles = useMemo(() => {
    const gpsByVehicle = new Map(gpsLocations.map(location => [location.vehicleId, location]));
    const visibleFleet = vehicles.filter(vehicle => ['available', 'in transit', 'on trip'].includes(vehicleStatus(vehicle).toLowerCase()));
    const knownIds = new Set(visibleFleet.map(vehicle => vehicle.id));
    const liveOnlyVehicles = gpsLocations
      .filter(location => !knownIds.has(location.vehicleId))
      .map(location => ({ id: location.vehicleId, registration: location.registration, status: 'GPS reporting', type: 'Fleet vehicle' }));

    return [...visibleFleet, ...liveOnlyVehicles].map((vehicle, index) => {
      const liveLocation = gpsByVehicle.get(vehicle.id);
      const storedCoordinates = vehicle.location || {};
      const latitude = Number(liveLocation?.latitude ?? vehicle.latitude ?? storedCoordinates.lat);
      const longitude = Number(liveLocation?.longitude ?? vehicle.longitude ?? storedCoordinates.lng);
      const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
      const hasGps = Boolean(liveLocation) || hasCoordinates;
      const locationLabel = liveLocation
        ? formatLocationTime(liveLocation.recordedAt)
        : vehicleStatus(vehicle).toLowerCase() === 'available' ? 'Staged at depot' : 'Awaiting GPS update';
      return {
        ...vehicle,
        liveLocation,
        locationLabel,
        hasGps,
        position: hasCoordinates ? { lat: latitude, lng: longitude } : previewCoordinates[index % previewCoordinates.length],
      };
    });
  }, [vehicles, gpsLocations]);
  const hasLivePositions = trackedVehicles.some(vehicle => vehicle.liveLocation);
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
      mapRef.current = new maps.Map(mapElement.current, {
        center: { lat: 6.9271, lng: 79.8612 },
        zoom: 11,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
      infoWindowRef.current = new maps.InfoWindow();
      setMapState('ready');
    }).catch(() => { if (mounted) setMapState('error'); });

    return () => { mounted = false; };
  }, [apiKey]);

  useEffect(() => {
    const maps = window.google?.maps;
    const map = mapRef.current;
    if (mapState !== 'ready' || !maps || !map) return;

    const activeIds = new Set(trackedVehicles.map(vehicle => vehicle.id));
    trackedVehicles.forEach((vehicle, index) => {
      let marker = markersRef.current.get(vehicle.id);
      if (!marker) {
        marker = new maps.Marker({ map, label: { text: String(index + 1), color: '#fff', fontWeight: '700' } });
        marker.addListener('click', () => {
          const current = markersRef.current.get(vehicle.id)?.vehicle;
          if (!current || !infoWindowRef.current) return;
          const content = document.createElement('div');
          const registration = document.createElement('strong');
          registration.textContent = current.registration || 'Fleet vehicle';
          const details = document.createElement('div');
          const speed = current.liveLocation?.speedKph === null || current.liveLocation?.speedKph === undefined
            ? '' : ` · ${current.liveLocation.speedKph} km/h`;
          details.textContent = `${current.name || current.type} · ${current.locationLabel}${speed}`;
          content.append(registration, details);
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open({ map, anchor: markersRef.current.get(vehicle.id) });
        });
        markersRef.current.set(vehicle.id, marker);
      }
      marker.vehicle = vehicle;
      marker.setPosition(vehicle.position);
      marker.setTitle(`${vehicle.registration || vehicle.id} · ${vehicle.locationLabel}`);
      marker.setLabel({ text: String(index + 1), color: '#fff', fontWeight: '700' });
    });

    for (const [vehicleId, marker] of markersRef.current) {
      if (!activeIds.has(vehicleId)) {
        marker.setMap(null);
        markersRef.current.delete(vehicleId);
      }
    }
  }, [mapState, trackedVehicles]);

  const trackingLabel = socketConnected ? 'LIVE GPS · SOCKET'
    : hasLivePositions ? 'GPS · 10s refresh'
    : trackingState === 'offline' ? 'GPS API unavailable'
      : trackingState === 'loading' ? 'Checking GPS feed' : 'Waiting for GPS';

  return <section className="live-map-panel" aria-labelledby="live-map-title">
    <div className="live-map-heading">
      <div><h2 id="live-map-title">Live Fleet Map</h2><p>Vehicle positions and latest GPS update times</p></div>
      <div className="live-map-heading-meta"><span className={`map-connection ${mapState === 'ready' ? 'connected' : ''}`}><i/>{mapState === 'ready' ? 'Google Maps connected' : mapState === 'loading' ? 'Loading map' : 'Map preview'}</span><span className="map-demo-tag">{trackingLabel}{hasDemoPositions ? ' · simulated markers' : ''}</span></div>
    </div>
    <div className="live-map-content">
      <div className={`live-map-canvas${mapState !== 'ready' ? ' map-placeholder' : ''}`}>
        <div className="google-map-element" ref={mapElement} role="application" aria-label="Google map with fleet vehicle markers" style={{ visibility: mapState === 'ready' ? 'visible' : 'hidden' }}/>
        {mapState !== 'ready' && <>
          <div className="map-preview-grid" aria-hidden="true"><span className="map-road road-one"/><span className="map-road road-two"/><span className="map-road road-three"/><span className="map-water"/><span className="map-area-label label-colombo">COLOMBO</span><span className="map-area-label label-kelaniya">KELANIYA</span><span className="map-area-label label-jaela">JA-ELA</span>
            {trackedVehicles.map((vehicle, index) => <span className={`map-preview-marker marker-${index % 4}`} key={vehicle.id} title={`${vehicle.registration || vehicle.id} · ${vehicle.locationLabel}`}><b>{index + 1}</b></span>)}
          </div>
          <div className="map-preview-message">{mapState === 'error' ? 'Google Maps could not load. Check the API key and connection.' : mapState === 'loading' ? 'Loading Google Maps…' : 'Connect a Google Maps API key to load the interactive map.'}</div>
          {!apiKey && <a className="open-google-maps" href="https://www.google.com/maps/search/?api=1&query=Colombo%2C+Sri+Lanka" target="_blank" rel="noreferrer">Open Colombo in Google Maps ↗</a>}
        </>}
      </div>
      <aside className="live-map-vehicle-list" aria-label="Tracked vehicles">
        <div className="map-list-heading"><strong>Tracked Vehicles</strong><span>{trackedVehicles.length}</span></div>
        {trackedVehicles.length ? trackedVehicles.map((vehicle, index) => <article className="map-vehicle-row" key={vehicle.id}>
          <span className="map-vehicle-number">{index + 1}</span>
          <div><strong>{vehicle.registration || vehicle.id}</strong><small>{vehicle.name || vehicle.type} · {vehicleStatus(vehicle)}</small><small className="map-vehicle-eta">{vehicle.locationLabel}{vehicle.liveLocation?.speedKph !== null && vehicle.liveLocation?.speedKph !== undefined ? ` · ${vehicle.liveLocation.speedKph} km/h` : ''}</small></div>
        </article>) : <p className="map-empty">No available or GPS-reporting vehicles to show.</p>}
        <p className="map-data-note">{hasLivePositions ? 'Live GPS points are stored by the tracking API; preview markers without a GPS report are simulated.' : trackingState === 'offline' ? 'The tracking API is unavailable. Preview markers are simulated until GPS data arrives.' : 'Waiting for GPS reports. Preview markers are simulated until a vehicle sends coordinates.'}</p>
      </aside>
    </div>
  </section>;
}
