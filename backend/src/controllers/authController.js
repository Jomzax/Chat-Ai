import mongoose from 'mongoose';
import {
  authenticateUser,
  findPublicUserById,
  registerUser,
} from '../services/authService.js';

const removeOtherSessionsForUser = async (userId, currentSessionId) => {
  try {
    const collection = mongoose.connection.collection('sessions');
    await collection.deleteMany({
      _id: { $ne: currentSessionId },
      session: { $regex: `"userId":"${userId}"` },
    });
  } catch (error) {
    console.error('Failed to clean up old sessions:', error);
  }
};

const establishSession = (req, user, res) => {
  req.session.regenerate((regenerateError) => {
    if (regenerateError) {
      return res.status(500).json({ message: 'Unable to start session.' });
    }

    req.session.userId = user.id;
    req.session.save(async (saveError) => {
      if (saveError) {
        return res.status(500).json({ message: 'Unable to save session.' });
      }

      await removeOtherSessionsForUser(user.id, req.sessionID);
      return res.json({ user });
    });
  });
};

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body || {});
    return establishSession(req, user, res);
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await authenticateUser(req.body || {});
    return establishSession(req, user, res);
  } catch (error) {
    return next(error);
  }
};

export const getSession = async (req, res, next) => {
  try {
    const user = await findPublicUserById(req.session?.userId);

    if (!user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
};

export const logout = (req, res) => {
  const allowedOrigins = (
    process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:3000,http://localhost:3000'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const hasHttpsOrigin = allowedOrigins.some((origin) => origin.startsWith('https://'));
  const forceCookieSecure = process.env.SESSION_COOKIE_SECURE === 'true';
  const cookieSecure = forceCookieSecure || (process.env.NODE_ENV === 'production' && hasHttpsOrigin);
  const cookieSameSite = cookieSecure ? 'none' : 'lax';

  req.session.destroy((destroyError) => {
    if (destroyError) {
      return res.status(500).json({ message: 'Unable to end session.' });
    }

    res.clearCookie(process.env.SESSION_COOKIE_NAME || 'chat_ai.sid', {
      httpOnly: true,
      sameSite: cookieSameSite,
      secure: cookieSecure,
    });
    return res.json({ message: 'Logged out.' });
  });
};
