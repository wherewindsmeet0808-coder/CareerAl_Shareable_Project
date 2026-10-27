import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { aiService } from '../services/aiService.js';
import { db } from '../config/db.js';

const router = Router();

const messageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message is too long'),
  language: z.enum(['en', 'ta']).default('en')
});

// Get Chat History
router.get('/history', requireAuth, async (req, res) => {
  try {
    const language = (req.query.lang === 'ta' ? 'ta' : 'en');
    const session = await db.getOrCreateChatSession(req.user.id, language);
    const messages = await db.getChatMessages(session.id, req.user.id);

    res.json({
      success: true,
      sessionId: session.id,
      language: session.language,
      messages,
      aiStatus: aiService.getStatus()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve chat messages.' });
  }
});

// Send Chat Message
router.post('/message', requireAuth, aiLimiter, async (req, res) => {
  try {
    const parseResult = messageSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Validation error'
      });
    }

    const { message, language } = parseResult.data;
    const session = await db.getOrCreateChatSession(req.user.id, language);

    // Save user message to database
    await db.addChatMessage(session.id, req.user.id, 'user', message);

    // Fetch message history for context
    const previousMessages = await db.getChatMessages(session.id, req.user.id);

    // Call AI Service
    const aiResponse = await aiService.chatWithCareerCoach({
      messages: previousMessages,
      studentProfile: req.user,
      language
    });

    // Save AI response to database
    const savedAssistantMsg = await db.addChatMessage(
      session.id,
      req.user.id,
      'assistant',
      aiResponse.content
    );

    res.json({
      success: true,
      message: savedAssistantMsg,
      meta: {
        isLiveAI: aiResponse.isLiveAI,
        source: aiResponse.source
      }
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ success: false, error: 'Failed to process message. Please try again.' });
  }
});

// Clear Chat History
router.delete('/history', requireAuth, async (req, res) => {
  try {
    const language = (req.query.lang === 'ta' ? 'ta' : 'en');
    const session = await db.getOrCreateChatSession(req.user.id, language);
    await db.clearChatMessages(session.id, req.user.id);

    res.json({
      success: true,
      message: 'Chat history cleared successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to clear chat history.' });
  }
});

export default router;
