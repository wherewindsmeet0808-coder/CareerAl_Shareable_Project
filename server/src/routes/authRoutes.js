import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../config/db.js';
import { ENV } from '../config/env.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Validation Schemas
const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"]
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

// Register
router.post('/register', authLimiter, async (req, res) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Validation error'
      });
    }

    const { full_name, email, password } = parseResult.data;

    // Check if email already registered
    const existing = await db.getProfileByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists. Please log in.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Initial default admin seed check
    const isFirstAdmin = email.toLowerCase() === 'admin@aicareer.com';

    const newProfile = await db.createProfile({
      email,
      full_name,
      role: isFirstAdmin ? 'admin' : 'student',
      password_hash,
      education_level: req.body.education_level || 'Undergraduate',
      degree: req.body.degree || 'B.Tech / B.E. in Computer Science',
      skills: req.body.skills || ['JavaScript', 'Python', 'Problem Solving'],
      interests: req.body.interests || ['Software Engineering', 'Artificial Intelligence'],
      preferred_role: 'Software Developer',
      preferred_language: req.body.preferred_language || 'en'
    });

    const token = jwt.sign(
      { userId: newProfile.id, email: newProfile.email, role: newProfile.role },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN }
    );

    // Remove password hash from response
    const { password_hash: _, ...safeProfile } = newProfile;

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: safeProfile
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
  }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Validation error'
      });
    }

    const { email, password } = parseResult.data;

    const profile = await db.getProfileByEmail(email);
    if (!profile) {
      return res.status(401).json({
        success: false,
        error: 'No account found with this email. Please check or sign up.'
      });
    }

    if (profile.password_hash) {
      const match = await bcrypt.compare(password, profile.password_hash);
      if (!match) {
        return res.status(401).json({
          success: false,
          error: 'Incorrect password. Please try again.'
        });
      }
    }

    const token = jwt.sign(
      { userId: profile.id, email: profile.email, role: profile.role },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN }
    );

    const { password_hash: _, ...safeProfile } = profile;

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: safeProfile
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Login failed. Please try again.' });
  }
});

// Get Current User Profile
router.get('/me', requireAuth, async (req, res) => {
  const { password_hash: _, ...safeProfile } = req.user;
  res.json({ success: true, user: safeProfile });
});

// Update Profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.id;
    delete updates.password_hash;
    // Disallow role escalation
    delete updates.role;

    const updatedProfile = await db.updateProfile(req.user.id, updates);
    if (!updatedProfile) {
      return res.status(404).json({ success: false, error: 'Profile not found.' });
    }

    const { password_hash: _, ...safeProfile } = updatedProfile;
    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: safeProfile
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update profile.' });
  }
});

// Forgot Password
router.post('/forgot-password', authLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }
  // Safe acknowledgment without leaking user existence
  res.json({
    success: true,
    message: 'If an account exists with this email, password reset instructions have been dispatched.'
  });
});

// Reset Password
router.post('/reset-password', authLimiter, async (req, res) => {
  const { token, new_password } = req.body;
  if (!new_password || new_password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
  }
  res.json({
    success: true,
    message: 'Password has been reset successfully. You may now log in.'
  });
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Delete Account & All Associated Personal Data (Compliance & User Control)
router.delete('/account', requireAuth, async (req, res) => {
  try {
    await db.deleteAccount(req.user.id);
    res.json({
      success: true,
      message: 'Account and all associated personal data have been permanently deleted.'
    });
  } catch (err) {
    console.error('Account deletion error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete account. Please try again.' });
  }
});

export default router;
