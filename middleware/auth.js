import { verifyToken } from '../lib/auth.js';

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.seller_token;
    if (!token) {
      console.log('Unauthorized: No token found in cookies');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      console.log('Unauthorized: Token verification failed');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = payload;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
