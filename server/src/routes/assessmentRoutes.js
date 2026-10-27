import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { db } from '../config/db.js';
import { generateRecommendations } from '../services/careerMatchingService.js';

const router = Router();

const assessmentSchema = z.object({
  education: z.string().min(2, 'Education level or degree is required'),
  technical_skills: z.array(z.string()).min(1, 'Please select at least 1 technical skill'),
  soft_skills: z.array(z.string()).optional().default([]),
  interests: z.array(z.string()).optional().default([]),
  experience_level: z.string().default('Student / Fresher'),
  projects_and_certifications: z.string().optional().default(''),
  preferred_work_mode: z.enum(['onsite', 'hybrid', 'remote']).default('remote'),
  career_goals: z.string().optional().default('')
});

// Submit Career Assessment
router.post('/submit', requireAuth, async (req, res) => {
  try {
    const parseResult = assessmentSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Validation error'
      });
    }

    const assessmentInput = parseResult.data;

    // 1. Persist the assessment in the database
    const savedAssessment = await db.createAssessment({
      user_id: req.user.id,
      ...assessmentInput
    });

    // 2. Fetch curated career roles from database
    const curatedRoles = await db.getCuratedRoles();

    // 3. Generate dynamic personalized recommendations
    const recommendations = generateRecommendations(assessmentInput, curatedRoles);

    // 4. Save recommendations associated with assessment
    const savedRecs = await db.saveRecommendations(savedAssessment.id, req.user.id, recommendations);

    // 5. Optionally sync skills & interests back to the user's main profile
    await db.updateProfile(req.user.id, {
      skills: Array.from(new Set([...(req.user.skills || []), ...assessmentInput.technical_skills])),
      interests: Array.from(new Set([...(req.user.interests || []), ...assessmentInput.interests])),
      education_level: assessmentInput.education,
      preferred_work_mode: assessmentInput.preferred_work_mode
    });

    res.json({
      success: true,
      message: 'Career assessment processed successfully!',
      assessmentId: savedAssessment.id,
      recommendations: savedRecs
    });
  } catch (err) {
    console.error('Assessment submission error:', err);
    res.status(500).json({ success: false, error: 'Failed to process career assessment.' });
  }
});

// Get Latest Assessment and Recommendations
router.get('/latest', requireAuth, async (req, res) => {
  try {
    const latestAssessment = await db.getLatestAssessment(req.user.id);
    const recommendations = await db.getRecommendationsByUserId(req.user.id);

    // If user has no assessments yet, generate baseline recommendations from profile
    if (!latestAssessment && recommendations.length === 0) {
      const curatedRoles = await db.getCuratedRoles();
      const profileData = {
        technical_skills: req.user.skills || ['JavaScript', 'Python'],
        soft_skills: ['Problem Solving', 'Teamwork'],
        interests: req.user.interests || ['Software Engineering'],
        education: req.user.degree || 'Computer Science',
        experience_level: req.user.experience_level || 'Student / Fresher'
      };
      const initialRecommendations = generateRecommendations(profileData, curatedRoles);
      return res.json({
        success: true,
        assessment: null,
        recommendations: initialRecommendations,
        isInitialPreview: true
      });
    }

    res.json({
      success: true,
      assessment: latestAssessment,
      recommendations
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve assessment data.' });
  }
});

export default router;
