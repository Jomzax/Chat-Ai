import bcrypt from 'bcrypt';
import User from '../models/user.js';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
const DEFAULT_ADMIN_EMAIL = 'admin@example.com';
const DEFAULT_ADMIN_PASSWORD = 'admin123';
const DEFAULT_ADMIN_NAME = 'Admin';

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
});

const createHttpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const registerUser = async ({ email, password, name }) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedName = String(name || normalizedEmail.split('@')[0] || '').trim();

  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    throw createHttpError('Please enter a valid email address.');
  }

  if (String(password || '').length < 8) {
    throw createHttpError('Password must be at least 8 characters.');
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw createHttpError('This email is already registered.', 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    email: normalizedEmail,
    passwordHash,
    name: normalizedName || normalizedEmail,
  });

  return publicUser(user);
};

export const authenticateUser = async ({ email, password }) => {
  const rawIdentifier = String(email || '').trim().toLowerCase();
  const defaultAdminEmail = String(process.env.DEFAULT_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL)
    .trim()
    .toLowerCase();
  const normalizedEmail = rawIdentifier.includes('@')
    ? rawIdentifier
    : rawIdentifier === 'admin' && defaultAdminEmail
      ? defaultAdminEmail
      : rawIdentifier;

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw createHttpError('Invalid email or password.', 401);
  }

  const passwordMatches = await bcrypt.compare(String(password || ''), user.passwordHash);

  if (!passwordMatches) {
    throw createHttpError('Invalid email or password.', 401);
  }

  return publicUser(user);
};

export const findPublicUserById = async (userId) => {
  if (!userId) {
    return null;
  }

  const user = await User.findById(userId);
  return user ? publicUser(user) : null;
};

export const ensureDefaultAdmin = async () => {
  const email = String(process.env.DEFAULT_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
  const password = String(process.env.DEFAULT_ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD);

  const exists = await User.exists({ email });

  if (exists) {
    return;
  }

  await registerUser({
    email,
    password,
    name: process.env.DEFAULT_ADMIN_NAME || DEFAULT_ADMIN_NAME,
  });
  console.log(`Default admin created: ${email}`);
};
