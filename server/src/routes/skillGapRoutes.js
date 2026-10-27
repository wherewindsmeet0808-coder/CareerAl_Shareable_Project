import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { db } from '../config/db.js';
import { CURATED_ROLES, CURATED_RESOURCES } from '../data/curatedCareers.js';
import { calculateRoleMatch } from '../services/careerMatchingService.js';

const router = Router();

// Get Skill Gap Analysis for Target Role
router.get('/analysis', requireAuth, async (req, res) => {
  try {
    const targetRole = req.query.role || req.user.preferred_role || 'Software Developer';
    const curatedRoles = await db.getCuratedRoles();
    const role = curatedRoles.find((r) => r.title.toLowerCase() === targetRole.toLowerCase()) || curatedRoles[0];

    // Fetch existing recorded progress from DB
    const savedProgress = await db.getSkillProgress(req.user.id, role.title);
    const progressMap = new Map();
    savedProgress.forEach((item) => progressMap.set(item.skill_name.toLowerCase(), item));

    const userSkills = (req.user.skills || []).map((s) => s.toLowerCase());

    // Technical skills analysis
    const technicalSkillsAnalysis = role.required_technical_skills.map((skillName, index) => {
      const lower = skillName.toLowerCase();
      const existing = progressMap.get(lower);
      const isKnown = userSkills.includes(lower) || userSkills.some((us) => us.includes(lower) || lower.includes(us));

      const resource = CURATED_RESOURCES.find(
        (r) => r.skill.toLowerCase() === lower || lower.includes(r.skill.toLowerCase())
      );

      // Estimated duration
      let estimatedDuration = '2 - 3 Weeks (Estimate)';
      let priority = index < 3 ? 'high' : index < 6 ? 'medium' : 'low';

      return {
        skill_name: skillName,
        category: 'technical',
        priority: existing?.priority || priority,
        status: existing?.status || (isKnown ? 'completed' : 'not_started'),
        progress_percent: existing?.progress_percent !== undefined ? existing.progress_percent : (isKnown ? 100 : 0),
        estimated_duration: existing?.estimated_duration || estimatedDuration,
        learning_url: existing?.learning_url || resource?.url || `https://www.google.com/search?q=${encodeURIComponent(skillName + ' learning roadmap tutorial')}`,
        provider: resource?.provider || 'Official Docs & Tutorials'
      };
    });

    // Soft skills analysis
    const softSkillsAnalysis = role.required_soft_skills.map((softSkill, index) => {
      const lower = softSkill.toLowerCase();
      const existing = progressMap.get(lower);
      return {
        skill_name: softSkill,
        category: 'soft',
        priority: index === 0 ? 'high' : 'medium',
        status: existing?.status || 'in_progress',
        progress_percent: existing?.progress_percent !== undefined ? existing.progress_percent : 50,
        estimated_duration: 'Ongoing practice in team projects (Estimate)',
        learning_url: 'https://hbr.org/topic/subject/communication',
        provider: 'Practical Exercises & Teamwork'
      };
    });

    // Dynamic current match score
    const currentEvaluation = calculateRoleMatch({
      skills: technicalSkillsAnalysis.filter((s) => s.status === 'completed' || s.progress_percent >= 80).map((s) => s.skill_name),
      degree: req.user.degree,
      experience_level: req.user.experience_level
    }, role);

    const completedCount = technicalSkillsAnalysis.filter((s) => s.status === 'completed' || s.progress_percent === 100).length;
    const inProgressCount = technicalSkillsAnalysis.filter((s) => s.status === 'in_progress').length;
    const totalRequired = technicalSkillsAnalysis.length;

    res.json({
      success: true,
      target_role: role.title,
      category: role.category,
      match_score: currentEvaluation.match_percentage,
      overview: {
        total_required: totalRequired,
        completed_count: completedCount,
        in_progress_count: inProgressCount,
        missing_count: totalRequired - completedCount - inProgressCount,
        readiness_percentage: Math.round((completedCount / (totalRequired || 1)) * 100)
      },
      technical_skills: technicalSkillsAnalysis,
      soft_skills: softSkillsAnalysis,
      available_roles: curatedRoles.map((r) => r.title)
    });
  } catch (err) {
    console.error('Skill gap error:', err);
    res.status(500).json({ success: false, error: 'Failed to compute skill gap analysis.' });
  }
});

const updateSkillSchema = z.object({
  target_role: z.string().min(1),
  skill_name: z.string().min(1),
  category: z.enum(['technical', 'soft']).default('technical'),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  status: z.enum(['not_started', 'in_progress', 'completed']),
  progress_percent: z.number().min(0).max(100),
  estimated_duration: z.string().optional()
});

// Update or Mark Skill Progress
router.post('/progress', requireAuth, async (req, res) => {
  try {
    const parseResult = updateSkillSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Validation error'
      });
    }

    const { target_role, ...skillData } = parseResult.data;

    // Save skill progress to database
    const saved = await db.upsertSkillProgress(req.user.id, target_role, skillData);

    // If marked completed, add to user's main profile skills array
    if (skillData.status === 'completed' || skillData.progress_percent === 100) {
      const currentSkills = new Set(req.user.skills || []);
      currentSkills.add(skillData.skill_name);
      await db.updateProfile(req.user.id, { skills: Array.from(currentSkills) });
    }

    res.json({
      success: true,
      message: 'Skill progress updated successfully!',
      data: saved
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update skill progress.' });
  }
});

export default router;
