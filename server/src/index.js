import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from './config/env.js';
import { db } from './config/db.js';
import { aiService } from './services/aiService.js';
import { standardLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/authRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import skillGapRoutes from './routes/skillGapRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: '*', // Allow frontend Vite dev server and production origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(standardLimiter);

// Health Check & System Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    databaseMode: db.getMode(),
    aiEngine: aiService.getStatus(),
    version: '1.0.0'
  });
});

// Mount API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);

// Optional: Serve client build in production if available
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'Endpoint not found.' });
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) next();
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.message);

  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      error: `File upload error: ${err.message}`
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
const server = app.listen(ENV.PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 AI Career Guidance REST API Server running on port ${ENV.PORT}`);
  console.log(`📡 Environment: ${ENV.NODE_ENV}`);
  console.log(`💾 Database Storage Mode: ${db.getMode().toUpperCase()}`);
  console.log(`🧠 AI Service: ${aiService.getStatus().provider}`);
  console.log(`🌐 Health check at: http://localhost:${ENV.PORT}/api/health`);
  console.log(`======================================================\n`);
});

export default app;
