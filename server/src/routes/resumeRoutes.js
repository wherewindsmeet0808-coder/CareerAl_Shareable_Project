import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { resumeUpload } from '../middleware/upload.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { extractTextFromDocument } from '../services/documentParser.js';
import { aiService } from '../services/aiService.js';
import { db } from '../config/db.js';

const router = Router();

// Upload and Analyze Resume
router.post('/upload', requireAuth, aiLimiter, resumeUpload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please select a resume file (PDF or DOCX) to upload.'
      });
    }

    const targetRole = req.body.target_role || req.user.preferred_role || 'Software Developer';
    const language = req.body.language || req.user.preferred_language || 'en';

    // 1. Extract plain text safely from file buffer
    const extractedText = await extractTextFromDocument(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    // 2. Analyze extracted text using AI Service (with transparent fallback)
    const analysis = await aiService.analyzeResume({
      resumeText: extractedText,
      targetRole,
      language
    });

    // 3. Persist analysis history in database
    const savedRecord = await db.saveResumeAnalysis({
      user_id: req.user.id,
      file_name: req.file.originalname,
      target_role: targetRole,
      ...analysis
    });

    res.json({
      success: true,
      message: 'Resume analyzed successfully!',
      analysis: savedRecord,
      meta: {
        file_name: req.file.originalname,
        file_size_bytes: req.file.size,
        chars_parsed: extractedText.length
      }
    });
  } catch (err) {
    console.error('Resume upload/analysis error:', err);
    res.status(400).json({
      success: false,
      error: err.message || 'An error occurred while parsing and analyzing your resume.'
    });
  }
});

// Get Resume Analysis History
router.get('/history', requireAuth, async (req, res) => {
  try {
    const history = await db.getResumeAnalyses(req.user.id);
    res.json({
      success: true,
      history
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve resume analysis history.' });
  }
});

// Delete a Resume Analysis Record
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteResumeAnalysis(req.user.id, id);
    res.json({
      success: true,
      message: 'Resume analysis record deleted securely.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete resume record.' });
  }
});

export default router;
