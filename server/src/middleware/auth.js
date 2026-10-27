import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { db } from '../config/db.js';
import { supabaseClient } from '../config/supabase.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in to continue.'
      });
    }

    const token = authHeader.split(' ')[1];

    // 1. If Supabase is active, try verifying via Supabase Auth
    if (supabaseClient) {
      try {
        const { data: { user }, error } = await supabaseClient.auth.getUser(token);
        if (!error && user) {
          const profile = await db.getProfileById(user.id);
          req.user = profile || { id: user.id, email: user.email, role: 'student' };
          return next();
        }
      } catch (e) {
        // Fall through to JWT verification
      }
    }

    // 2. Standard JWT verification
    jwt.verify(token, ENV.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          error: 'Your session has expired or is invalid. Please log in again.'
        });
      }

      const profile = await db.getProfileById(decoded.userId);
      if (!profile) {
        return res.status(401).json({
          success: false,
          error: 'User profile not found. Please log in again.'
        });
      }

      req.user = profile;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Authentication service encountered an error.'
    });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Administrator privileges are required to access this resource.'
    });
  }
  next();
}
