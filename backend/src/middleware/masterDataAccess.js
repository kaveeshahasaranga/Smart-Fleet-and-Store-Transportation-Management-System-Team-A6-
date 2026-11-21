import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { httpError } from '../utils/http.js';

export function authenticateMasterData(req, _res, next) {
  // A local preview mode must be explicitly enabled and can never run in production.
  if (env.nodeEnv === 'development' && env.devMasterDataAccess && ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress)) {
    req.user = { id: 'local-development', role: 'admin' };
    return next();
  }
  const match = /^Bearer (\S+)$/.exec(req.headers.authorization || '');
  if (!match) return next(httpError(401, 'Sign in to access fleet and catalog data.'));
  if (!env.jwtSecret || env.jwtSecret.length < 32) return next(httpError(503, 'Token verification is not configured.'));
  try {
    const claims = jwt.verify(match[1], env.jwtSecret, { algorithms: ['HS256'] });
    if (!claims || typeof claims !== 'object' || typeof claims.sub !== 'string' || !claims.sub || !Number.isFinite(claims.exp)) {
      throw new Error('Invalid identity claims');
    }
    if (!['admin', 'store', 'customer'].includes(claims.role)) return next(httpError(403, 'Unsupported account role.'));
    req.user = { id: claims.sub, role: claims.role };
    next();
  } catch {
    next(httpError(401, 'Your session is invalid or expired. Sign in again.'));
  }
}

export function requireMasterDataAdmin(req, _res, next) {
  if (req.user?.role !== 'admin') return next(httpError(403, 'Administrator access is required.'));
  next();
}
