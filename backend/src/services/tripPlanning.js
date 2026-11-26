export function generateStopSequence(stops = []) {
  const orderedStops = stops
    .map((stop, index) => ({ ...stop, _originalIndex: index }))
    .sort((left, right) => {
      const leftDistance = Number.isFinite(Number(left.distance)) ? Number(left.distance) : Number.POSITIVE_INFINITY;
      const rightDistance = Number.isFinite(Number(right.distance)) ? Number(right.distance) : Number.POSITIVE_INFINITY;
      const priorityDifference = Number(/priority|urgent/i.test(right.tag || '')) - Number(/priority|urgent/i.test(left.tag || ''));
      return leftDistance - rightDistance || priorityDifference || left._originalIndex - right._originalIndex;
    })
    .map(({ _originalIndex, ...stop }, index) => ({ ...stop, sequence: index + 1 }));

  return {
    stops: orderedStops,
    totalDistance: orderedStops.reduce((sum, stop) => sum + Math.max(0, Number(stop.distance) || 0), 0),
    strategy: 'Estimated stop distance, with priority stops first when estimates tie',
  };
}

export function allocateVehicle({ load, vehicles = [], requiredType = '' }) {
  const tripLoad = Number(load);
  const normalizedType = String(requiredType).trim().toLowerCase();
  if (!Number.isFinite(tripLoad) || tripLoad < 0) {
    const error = new Error('Trip load must be a non-negative number.');
    error.status = 400;
    throw error;
  }

  const candidates = vehicles
    .filter(vehicle => {
      const capacity = Number(vehicle.capacity);
      return String(vehicle.status || '').trim().toLowerCase() === 'available'
        && String(vehicle.id || '').trim()
        && String(vehicle.registration || '').trim()
        && Number.isFinite(capacity)
        && capacity >= tripLoad
        && (!normalizedType || String(vehicle.type || '').trim().toLowerCase() === normalizedType);
    })
    .sort((left, right) => Number(left.capacity) - Number(right.capacity)
      || String(left.registration).localeCompare(String(right.registration)));

  if (!candidates.length) {
    const error = new Error('No available vehicle has enough payload capacity for this trip.');
    error.status = 409;
    throw error;
  }

  const vehicle = candidates[0];
  return {
    vehicle: {
      id: String(vehicle.id).trim(),
      registration: String(vehicle.registration).trim(),
      name: String(vehicle.name || ''),
      type: String(vehicle.type || ''),
      capacity: Number(vehicle.capacity),
    },
    driver: String(vehicle.driver || '').trim(),
    remainingCapacity: Number(vehicle.capacity) - tripLoad,
    utilizationPercent: Number(vehicle.capacity) === 0 ? 0 : Math.round(tripLoad / Number(vehicle.capacity) * 100),
  };
}
