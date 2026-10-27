import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { db } from '../config/db.js';
import { aiService } from '../services/aiService.js';
import { fetchLiveJobs } from '../services/jobService.js';

const router = Router();

// Apply auth and admin checks to ALL admin endpoints
router.use(requireAuth);
router.use(requireAdmin);

// 1. Get Aggregate Analytics & Platform Health
router.get('/metrics', async (req, res) => {
  try {
    const stats = await db.getAdminStats();
    const aiStatus = aiService.getStatus();

    // Check Job API health
    let jobApiHealth = { status: 'healthy', latencyMs: 0, checkedAt: new Date().toISOString() };
    const startTime = Date.now();
    try {
      await fetchLiveJobs({ limit: 2 });
      jobApiHealth.latencyMs = Date.now() - startTime;
    } catch (e) {
      jobApiHealth.status = 'degraded';
      jobApiHealth.error = e.message;
    }

    // System Environment Status
    const systemStatus = {
      databaseMode: db.getMode(),
      aiEngine: aiStatus.provider,
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    };

    res.json({
      success: true,
      stats,
      health: {
        ai: aiStatus,
        jobApi: jobApiHealth,
        system: systemStatus
      }
    });
  } catch (err) {
    console.error('Admin metrics error:', err);
    res.status(500).json({ success: false, error: 'Failed to compute admin metrics.' });
  }
});

// 2. Manage Curated Career Roles (List, Create, Update, Delete)
router.get('/roles', async (req, res) => {
  try {
    const roles = await db.getCuratedRoles();
    res.json({ success: true, roles });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch career roles.' });
  }
});

const careerRoleSchema = z.object({
  title: z.string().min(2),
  category: z.string().min(2),
  description: z.string().min(10),
  required_technical_skills: z.array(z.string()).min(1),
  required_soft_skills: z.array(z.string()).optional().default([]),
  suitable_degrees: z.array(z.string()).optional().default([]),
  market_demand: z.string().default('High'),
  avg_salary_range: z.string().optional().default('Competitive')
});

router.post('/roles', async (req, res) => {
  try {
    const parseResult = careerRoleSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, error: parseResult.error.errors[0]?.message });
    }

    const savedRole = await db.upsertCuratedRole(parseResult.data);
    await db.logAdminAction(req.user.id, 'CREATE_OR_UPDATE_CAREER_ROLE', 'career_role', { title: savedRole.title });

    res.json({ success: true, message: 'Career role saved successfully.', role: savedRole });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save career role.' });
  }
});

router.delete('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteCuratedRole(id);
    await db.logAdminAction(req.user.id, 'DELETE_CAREER_ROLE', 'career_role', { id });
    res.json({ success: true, message: 'Career role deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete role.' });
  }
});

// 3. Manage Curated Learning Resources
router.get('/resources', async (req, res) => {
  try {
    const resources = await db.getLearningResources();
    res.json({ success: true, resources });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch learning resources.' });
  }
});

const resourceSchema = z.object({
  title: z.string().min(2),
  skill: z.string().min(1),
  provider: z.string().min(1),
  url: z.string().url(),
  is_free: z.boolean().default(true),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner')
});

router.post('/resources', async (req, res) => {
  try {
    const parseResult = resourceSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, error: parseResult.error.errors[0]?.message });
    }

    const saved = await db.upsertLearningResource(parseResult.data);
    await db.logAdminAction(req.user.id, 'CREATE_LEARNING_RESOURCE', 'learning_resource', { title: saved.title });

    res.json({ success: true, message: 'Learning resource added successfully.', resource: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save resource.' });
  }
});

// 4. View Audit Logs
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await db.getAdminAuditLogs(50);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve audit logs.' });
  }
});

export default router;
