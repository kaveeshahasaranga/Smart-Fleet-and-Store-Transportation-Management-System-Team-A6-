let stores = [
  {
    _id: '1',
    storeId: 'STR-305',
    name: 'Colombo Central Hub #305',
    address: '45 Baseline Rd, Colombo 09',
    location: 'Colombo (Western)',
    coords: '6.9271° N, 79.8612° E',
    contact: 'Nimal Perera',
    phone: '+94 77 234 5678',
    hours: '07:00 – 21:00',
    isShifted: false,
    status: 'Active',
    classification: 'Central Distribution Center',
    geofenceBuffer: '250m',
    standardIntakeWindow: '60 Minutes',
    maxSimultaneousCarriers: '6 Carriers',
    sanitationBuffer: '15 Minutes',
    autoConflictPrevention: true,
    overstayPenaltyAlert: true,
    bays: [],
  },
];

let schedules = [
  {
    _id: '101',
    storeId: 'STR-305',
    bayNumber: '01',
    bookingCode: 'BK-8831',
    companyName: 'Cargills Logistics',
    slotType: 'standard',
    badgeText: 'Unloaded',
    timeRange: '08:00 - 10:00',
    startCol: 1,
    endCol: 3,
    note: 'Morning intake',
    date: new Date().toISOString().split('T')[0],
  },
  {
    _id: '102',
    storeId: 'STR-305',
    bayNumber: '01',
    bookingCode: 'BK-8849',
    companyName: 'Keells Supply Chain SL',
    slotType: 'confirmed',
    badgeText: 'Intake Active',
    timeRange: '12:00 - 15:00',
    startCol: 5,
    endCol: 8,
    note: 'Heavy bay slot',
    date: new Date().toISOString().split('T')[0],
  },
  {
    _id: '103',
    storeId: 'STR-305',
    bayNumber: '02',
    bookingCode: 'BK-8837',
    companyName: 'Highland Dairies SL',
    slotType: 'confirmed',
    badgeText: 'Chilled Dock',
    timeRange: '09:00 - 12:00',
    startCol: 2,
    endCol: 5,
    note: 'Chilled storage',
    date: new Date().toISOString().split('T')[0],
  },
  {
    _id: '104',
    storeId: 'STR-305',
    bayNumber: '02',
    bookingCode: 'BK-8845',
    companyName: 'Elephant House Dairy',
    slotType: 'pending',
    badgeText: '',
    timeRange: '12:00 - 14:00',
    startCol: 5,
    endCol: 7,
    note: 'Awaiting Driver',
    date: new Date().toISOString().split('T')[0],
  },
  {
    _id: '105',
    storeId: 'STR-305',
    bayNumber: '04',
    bookingCode: '',
    companyName: 'Hydraulic Ramp Service',
    slotType: 'offline',
    badgeText: 'OFFLINE',
    timeRange: '11:00 - 14:00',
    startCol: 4,
    endCol: 7,
    note: 'Maintenance window',
    date: new Date().toISOString().split('T')[0],
  },
];

export const readStores = () => [...stores];

export const findStore = (storeId) =>
  stores.find((s) => s.storeId === storeId || s._id === storeId) || null;

export const insertStore = (storeData) => {
  const newStore = {
    _id: String(Date.now()),
    coords: '6.8649° N, 79.8997° E',
    hours: '07:00 – 21:00',
    isShifted: false,
    status: 'Active',
    classification: 'Central Distribution Center',
    geofenceBuffer: '250m',
    standardIntakeWindow: '60 Minutes',
    maxSimultaneousCarriers: '6 Carriers',
    sanitationBuffer: '15 Minutes',
    autoConflictPrevention: true,
    overstayPenaltyAlert: true,
    bays: [],
    ...storeData,
  };
  stores.unshift(newStore);
  return newStore;
};

export const patchStore = (storeId, updateData) => {
  const index = stores.findIndex((s) => s.storeId === storeId || s._id === storeId);
  if (index === -1) return null;
  stores[index] = { ...stores[index], ...updateData };
  return stores[index];
};

export const removeStoreById = (storeId) => {
  const index = stores.findIndex((s) => s.storeId === storeId || s._id === storeId);
  if (index === -1) return null;
  const [deleted] = stores.splice(index, 1);
  return deleted;
};

export const readSchedules = (storeId = 'STR-305') =>
  schedules
    .filter((item) => item.storeId === storeId)
    .sort((a, b) => {
      const bayCmp = String(a.bayNumber).localeCompare(String(b.bayNumber));
      return bayCmp !== 0 ? bayCmp : (a.startCol || 0) - (b.startCol || 0);
    });

export const insertSchedule = (slotData) => {
  const newSlot = {
    _id: String(Date.now()),
    storeId: 'STR-305',
    slotType: 'standard',
    date: new Date().toISOString().split('T')[0],
    ...slotData,
  };
  schedules.push(newSlot);
  return newSlot;
};

export const patchSchedule = (id, updateData) => {
  const index = schedules.findIndex((item) => item._id === id);
  if (index === -1) return null;
  schedules[index] = { ...schedules[index], ...updateData };
  return schedules[index];
};

export const removeScheduleById = (id) => {
  const index = schedules.findIndex((item) => item._id === id);
  if (index === -1) return null;
  const [deleted] = schedules.splice(index, 1);
  return deleted;
};