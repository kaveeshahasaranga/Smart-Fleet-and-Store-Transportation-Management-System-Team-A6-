import mongoose from 'mongoose';
import Store from './store.model.js';
import {
  readStores,
  findStore,
  insertStore,
  patchStore,
  removeStoreById,
} from './storage.service.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

export const getAllStores = async (filters = {}) => {
  if (isDbConnected()) {
    const query = {};
    if (filters.status && filters.status !== 'All statuses') {
      query.status = filters.status;
    }
    if (filters.region && filters.region !== 'All Regions') {
      query.location = { $regex: filters.region, $options: 'i' };
    }
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { storeId: { $regex: filters.search, $options: 'i' } },
        { location: { $regex: filters.search, $options: 'i' } },
      ];
    }
    return await Store.find(query).sort({ createdAt: -1 });
  }

  let result = readStores();
  if (filters.status && filters.status !== 'All statuses') {
    result = result.filter((s) => s.status === filters.status);
  }
  if (filters.region && filters.region !== 'All Regions') {
    const reg = filters.region.toLowerCase();
    result = result.filter((s) => (s.location || '').toLowerCase().includes(reg));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (s) =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.storeId || '').toLowerCase().includes(q) ||
        (s.location || '').toLowerCase().includes(q)
    );
  }
  return result;
};

export const getStoreById = async (storeId) => {
  if (isDbConnected()) {
    return await Store.findOne({ storeId });
  }
  return findStore(storeId);
};

export const createStore = async (storeData) => {
  if (!storeData.storeId) {
    const randomNum = Math.floor(500 + Math.random() * 499);
    storeData.storeId = `STR-${randomNum}`;
  }

  if (isDbConnected()) {
    const store = new Store(storeData);
    return await store.save();
  }

  return insertStore(storeData);
};

export const updateStoreConfig = async (storeId, updateData) => {
  if (isDbConnected()) {
    return await Store.findOneAndUpdate(
      { storeId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  return patchStore(storeId, updateData);
};

export const addStoreBay = async (storeId, bayData) => {
  if (isDbConnected()) {
    return await Store.findOneAndUpdate(
      { storeId },
      { $push: { bays: bayData } },
      { new: true, runValidators: true }
    );
  }

  const current = findStore(storeId);
  if (!current) return null;
  const bays = Array.isArray(current.bays) ? [...current.bays, bayData] : [bayData];
  return patchStore(storeId, { bays });
};

export const deleteStore = async (storeId) => {
  if (isDbConnected()) {
    return await Store.findOneAndDelete({ storeId });
  }

  return removeStoreById(storeId);
};