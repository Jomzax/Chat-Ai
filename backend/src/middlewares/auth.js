import { findPublicUserById } from '../services/authService.js';

export const requireAuth = async (req, res, next) => {
  try {
    const user = await findPublicUserById(req.session?.userId);

    if (!user) {
      return res.status(401).json({ message: 'Please sign in to continue.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};
