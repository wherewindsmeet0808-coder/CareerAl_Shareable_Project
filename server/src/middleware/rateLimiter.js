import rateLimit from 'express-rate-limit';

// Standard API rate limiter
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again after a few minutes.'
  }
});

// Stricter rate limiter for expensive AI & upload endpoints
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60, // 60 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'AI query rate limit reached. Please wait a moment before sending another request.'
  }
});

// Auth rate limiter to protect against brute force
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again later.'
  }
});
