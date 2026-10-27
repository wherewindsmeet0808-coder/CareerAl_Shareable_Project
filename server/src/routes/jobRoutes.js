import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { searchJobs } from '../services/jobService.js';
import { db } from '../config/db.js';

const router = Router();

// Search Jobs & Internships
router.get('/search', async (req, res) => {
  try {
    const { query = '', location = '', work_mode = 'all', experience = 'all', job_type = 'all' } = req.query;

    const results = await searchJobs({
      query: String(query),
      location: String(location),
      workMode: String(work_mode),
      experience: String(experience),
      jobType: String(job_type)
    });

    res.json({
      success: true,
      data: results
    });
  } catch (err) {
    console.error('Job search error:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve job listings.' });
  }
});

// Get User's Saved Jobs & Tracked Applications
router.get('/saved', requireAuth, async (req, res) => {
  try {
    const saved = await db.getSavedJobs(req.user.id);
    res.json({
      success: true,
      saved
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch saved jobs.' });
  }
});

const saveJobSchema = z.object({
  job_id: z.string().min(1),
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional().default('Remote'),
  work_mode: z.string().optional().default('remote'),
  apply_url: z.string().url().or(z.string().min(1)),
  skills: z.array(z.string()).optional().default([]),
  status: z.enum(['bookmarked', 'applied', 'interviewing', 'offered', 'rejected']).default('bookmarked'),
  notes: z.string().optional().default(''),
  applied_date: z.string().nullable().optional()
});

// Bookmark / Save / Track a Job
router.post('/save', requireAuth, async (req, res) => {
  try {
    const parseResult = saveJobSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Validation error'
      });
    }

    const saved = await db.saveOrUpdateJob(req.user.id, parseResult.data);
    res.json({
      success: true,
      message: 'Job status updated in your tracker!',
      data: saved
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save job.' });
  }
});

// Remove a Saved Job
router.delete('/save/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteSavedJob(req.user.id, id);
    res.json({
      success: true,
      message: 'Job removed from tracker.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to remove job.' });
  }
});

export default router;
