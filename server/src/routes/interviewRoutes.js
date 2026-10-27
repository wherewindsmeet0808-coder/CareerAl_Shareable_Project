import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { aiService } from '../services/aiService.js';
import { db } from '../config/db.js';

const router = Router();

const startSessionSchema = z.object({
  target_role: z.string().default('Software Developer'),
  category: z.enum(['technical', 'hr', 'behavioral', 'role-specific']).default('technical'),
  experience_level: z.string().default('Student / Fresher'),
  language: z.enum(['en', 'ta']).default('en')
});

const submitAnswerSchema = z.object({
  session_id: z.string().uuid(),
  question_index: z.number().int().min(0),
  question_text: z.string().min(5),
  answer_text: z.string().min(2, 'Please provide an answer before submitting.'),
  language: z.enum(['en', 'ta']).default('en')
});

// Start new interview session
router.post('/start', requireAuth, aiLimiter, async (req, res) => {
  try {
    const parseResult = startSessionSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Validation error'
      });
    }

    const { target_role, category, experience_level } = parseResult.data;

    // Generate questions using AI Service
    const { questions, isLiveAI } = await aiService.generateInterviewQuestions({
      role: target_role,
      category,
      experienceLevel: experience_level
    });

    const session = await db.createInterviewSession({
      user_id: req.user.id,
      target_role,
      category,
      experience_level,
      questions
    });

    res.json({
      success: true,
      session,
      isLiveAI,
      totalQuestions: questions.length
    });
  } catch (err) {
    console.error('Start interview error:', err);
    res.status(500).json({ success: false, error: 'Failed to start interview practice session.' });
  }
});

// Submit answer for a question & evaluate
router.post('/answer', requireAuth, aiLimiter, async (req, res) => {
  try {
    const parseResult = submitAnswerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Validation error'
      });
    }

    const { session_id, question_index, question_text, answer_text, language } = parseResult.data;

    const session = await db.getInterviewSession(session_id, req.user.id);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Interview session not found.' });
    }

    // Evaluate answer with AI Service
    const evaluation = await aiService.evaluateInterviewAnswer({
      question: question_text,
      answer: answer_text,
      role: session.target_role,
      language
    });

    // Save answer and evaluation to database
    const savedAnswer = await db.saveInterviewAnswer({
      session_id,
      user_id: req.user.id,
      question_index,
      question_text,
      answer_text,
      score: evaluation.score,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      model_answer: evaluation.model_answer
    });

    // Check if session completed
    const updatedSession = await db.getInterviewSession(session_id, req.user.id);

    res.json({
      success: true,
      evaluation: {
        score: evaluation.score,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        model_answer: evaluation.model_answer,
        isLiveAI: evaluation.isLiveAI,
        source: evaluation.source
      },
      session: updatedSession
    });
  } catch (err) {
    console.error('Answer evaluation error:', err);
    res.status(500).json({ success: false, error: 'Failed to evaluate interview response.' });
  }
});

// Get User's Mock Interview History
router.get('/history', requireAuth, async (req, res) => {
  try {
    const history = await db.getInterviewHistory(req.user.id);
    res.json({
      success: true,
      history
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve interview history.' });
  }
});

export default router;
