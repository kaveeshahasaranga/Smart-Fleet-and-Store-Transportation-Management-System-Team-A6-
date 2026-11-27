import {
  authenticateAccount,
  registerAccount,
  requestPasswordReset,
  resetAccountPassword,
} from './auth.service.js';

export async function signUp(req, res, next) {
  try {
    const result = await registerAccount(req.body || {});
    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function signIn(req, res, next) {
  try {
    res.json({ data: await authenticateAccount(req.body?.email, req.body?.password) });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    res.json(await requestPasswordReset(req.body?.email));
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    res.json(await resetAccountPassword(req.body || {}));
  } catch (error) {
    next(error);
  }
}
