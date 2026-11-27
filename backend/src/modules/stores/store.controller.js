import * as storeService from './store.service.js';

export const getStores = async (req, res, next) => {
  try {
    const stores = await storeService.getAllStores(req.query);
    res.status(200).json({ success: true, count: stores.length, data: stores });
  } catch (error) {
    next(error);
  }
};

export const getStore = async (req, res, next) => {
  try {
    const store = await storeService.getStoreById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    res.status(200).json({ success: true, data: store });
  } catch (error) {
    next(error);
  }
};

export const addStore = async (req, res, next) => {
  try {
    const newStore = await storeService.createStore(req.body);
    res.status(201).json({ success: true, data: newStore });
  } catch (error) {
    next(error);
  }
};

export const updateStore = async (req, res, next) => {
  try {
    const updatedStore = await storeService.updateStoreConfig(req.params.storeId, req.body);
    if (!updatedStore) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    res.status(200).json({ success: true, data: updatedStore });
  } catch (error) {
    next(error);
  }
};

export const addBay = async (req, res, next) => {
  try {
    const updatedStore = await storeService.addStoreBay(req.params.storeId, req.body);
    if (!updatedStore) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    res.status(201).json({ success: true, data: updatedStore });
  } catch (error) {
    next(error);
  }
};

export const removeStore = async (req, res, next) => {
  try {
    const deleted = await storeService.deleteStore(req.params.storeId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    res.status(200).json({ success: true, message: 'Store deleted successfully' });
  } catch (error) {
    next(error);
  }
};