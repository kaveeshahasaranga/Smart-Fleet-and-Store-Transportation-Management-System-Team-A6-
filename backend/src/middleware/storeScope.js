import { httpError } from '../utils/http.js';

export function requireRoles(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.user?.role)) return next(httpError(403, 'You do not have permission to perform this action.'));
    next();
  };
}

export function requireStoreScope(req, _res, next) {
  const requestedStoreId = req.params.storeId || req.query.storeId || req.body?.storeId;
  if (req.user?.role === 'admin') {
    req.scopedStoreId = requestedStoreId || null;
    return next();
  }
  if (req.user?.role !== 'store' || !req.user.storeId) {
    return next(httpError(403, 'A store assignment is required for this action.'));
  }
  if (requestedStoreId && requestedStoreId !== req.user.storeId) {
    return next(httpError(403, 'You do not have access to this store.'));
  }
  req.scopedStoreId = req.user.storeId;
  next();
}
