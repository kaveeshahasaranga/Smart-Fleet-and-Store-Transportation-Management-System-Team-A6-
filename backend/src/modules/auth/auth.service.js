import { createHash, randomBytes, scrypt as callbackScrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';
import { httpError } from '../../utils/http.js';
import User from './user.model.js';

const scrypt = promisify(callbackScrypt);
const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,128}$/;
const storeIdsByLocation = { nugegoda: 'STR-104', colombo: 'STR-305', kandy: 'STR-412' };

export function normalizeEmail(email) {
  if (typeof email !== 'string' || email.length > 254) throw httpError(400, 'Enter a valid email address.');
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw httpError(400, 'Enter a valid email address.');
  return normalized;
}

export function validatePassword(password) {
  if (typeof password !== 'string' || !passwordPattern.test(password)) {
    throw httpError(400, 'Use 8–128 characters, including an uppercase letter and a number.');
  }
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, encodedHash) {
  const [algorithm, salt, storedHex] = encodedHash.split('$');
  if (algorithm !== 'scrypt' || !salt || !/^[a-f0-9]{128}$/.test(storedHex || '')) return false;
  const stored = Buffer.from(storedHex, 'hex');
  const derived = await scrypt(password, salt, stored.length);
  return timingSafeEqual(stored, derived);
}

function signInToken(user) {
  requireJwtSecret();
  return jwt.sign({ role: user.role, ver: user.tokenVersion }, env.jwtSecret, {
    algorithm: 'HS256',
    subject: user.id,
    expiresIn: '8h',
  });
}

function requireJwtSecret() {
  if (!env.jwtSecret || env.jwtSecret.length < 32) throw httpError(503, 'Authentication is not configured. Set JWT_SECRET to at least 32 characters.');
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    ...(user.role === 'store' ? { storeId: user.storeId, storeRole: user.storeRole, storeLocation: user.storeLocation } : {}),
  };
}

export async function registerAccount(input) {
  requireJwtSecret();
  const { name, email, phone, storeLocation, storeRole, password } = input;
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 120) throw httpError(400, 'Enter your full name.');
  if (typeof phone !== 'string' || !phone.trim() || phone.trim().length > 32) throw httpError(400, 'Enter a valid contact number.');
  if (typeof storeLocation !== 'string' || !storeIdsByLocation[storeLocation.trim().toLowerCase()]) throw httpError(400, 'Select a supported store location.');
  if (!['staff', 'manager'].includes(storeRole)) throw httpError(400, 'Select a valid store role.');
  validatePassword(password);

  let user;
  try {
    user = await User.create({
      name: name.trim(),
      email: normalizeEmail(email),
      phone: phone.trim(),
      storeLocation: storeLocation.trim(),
      storeId: storeIdsByLocation[storeLocation.trim().toLowerCase()],
      storeRole,
      passwordHash: await hashPassword(password),
    });
  } catch (error) {
    if (error.code === 11000) throw httpError(409, 'An account with this email already exists.');
    throw error;
  }
  return { token: signInToken(user), user: publicUser(user) };
}

export async function createAdminAccount({ email, password }) {
  requireJwtSecret();
  validatePassword(password);
  const normalizedEmail = normalizeEmail(email);
  if (await User.exists({ email: normalizedEmail })) throw httpError(409, 'An account with this email already exists.');
  const user = await User.create({
    name: 'FleetFlow Administrator',
    email: normalizedEmail,
    role: 'admin',
    passwordHash: await hashPassword(password),
  });
  return publicUser(user);
}

export async function authenticateAccount(email, password) {
  requireJwtSecret();
  const normalizedEmail = normalizeEmail(email);
  if (typeof password !== 'string' || !password) throw httpError(400, 'Enter your email and password.');
  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw httpError(401, 'Email or password is incorrect.');
  }
  return { token: signInToken(user), user: publicUser(user) };
}

function hashResetToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function resetLink(email, token) {
  const origin = env.clientUrl.split(',')[0].trim();
  const url = new URL('/reset-password', origin);
  url.searchParams.set('email', email);
  url.searchParams.set('token', token);
  return url.toString();
}

function mailTransport() {
  const { smtpHost, smtpPort, smtpUser, smtpPassword, smtpFrom, smtpSecure } = env;
  if (!smtpHost || !smtpFrom) return null;
  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    ...(smtpUser && smtpPassword ? { auth: { user: smtpUser, pass: smtpPassword } } : {}),
  });
}

export async function requestPasswordReset(email) {
  const normalizedEmail = normalizeEmail(email);
  const transporter = mailTransport();
  if (!transporter && env.nodeEnv === 'production') {
    throw httpError(503, 'Password recovery email is not configured.');
  }
  const user = await User.findOne({ email: normalizedEmail });
  const response = { message: 'If that email is registered, password reset instructions will be sent.' };
  if (!user) return response;

  const token = randomBytes(32).toString('hex');
  user.resetTokenHash = hashResetToken(token);
  user.resetTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await user.save();

  const link = resetLink(normalizedEmail, token);
  if (transporter) {
    try {
      await transporter.sendMail({
        from: env.smtpFrom,
        to: normalizedEmail,
        subject: 'Reset your FleetFlow password',
        text: `Use this one-time link within 30 minutes to reset your password:\n\n${link}\n\nIf you did not request this, you can ignore this email.`,
      });
    } catch (error) {
      console.error('Password reset email delivery failed:', error.message);
      throw httpError(502, 'Unable to send password reset email. Please try again later.');
    }
  } else {
    response.resetUrl = link;
  }
  return response;
}

export async function resetAccountPassword({ email, token, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) throw httpError(400, 'This reset link is invalid or expired.');
  validatePassword(password);
  const now = new Date();
  const result = await User.updateOne(
    { email: normalizedEmail, resetTokenHash: hashResetToken(token), resetTokenExpiresAt: { $gt: now } },
    {
      $set: { passwordHash: await hashPassword(password) },
      $unset: { resetTokenHash: 1, resetTokenExpiresAt: 1 },
      $inc: { tokenVersion: 1 },
    }
  );
  if (result.modifiedCount !== 1) throw httpError(400, 'This reset link is invalid or expired.');
  return { message: 'Password updated. Please sign in with your new password.' };
}
