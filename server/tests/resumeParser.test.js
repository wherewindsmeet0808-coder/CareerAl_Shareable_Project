import test from 'node:test';
import assert from 'node:assert';
import { aiService } from '../src/services/aiService.js';

test('AI service analyzeResume fallback returns comprehensive ATS metrics', async () => {
  const sampleResume = `
    PRIYA SHARMA
    Email: priya@example.com | GitHub: github.com/priya | LinkedIn: linkedin.com/in/priya
    EDUCATION:
    Bachelor of Technology in Computer Science & Engineering, 2026 Batch
    TECHNICAL SKILLS:
    JavaScript, TypeScript, React, Node.js, Express, SQL, Git, HTML, CSS, Tailwind
    PROJECTS:
    E-Commerce Web Portal: Built full-stack responsive web application using React and Node.js.
    Designed normalized PostgreSQL schema and implemented JWT auth.
  `;

  const analysis = await aiService.analyzeResume({
    resumeText: sampleResume,
    targetRole: 'Software Developer',
    language: 'en'
  });

  assert.ok(analysis.ats_score >= 50 && analysis.ats_score <= 100, 'ATS score should be in valid range');
  assert.ok(analysis.detected_skills.length > 0, 'Should detect candidate skills');
  assert.ok(analysis.strengths.length > 0, 'Should provide strengths');
  assert.ok(analysis.weaknesses.length > 0, 'Should provide constructive weaknesses');
  assert.ok(analysis.actionable_improvements.length > 0, 'Should offer actionable tips');
  assert.ok(analysis.ats_feedback.formatting, 'Should evaluate layout and formatting');
  assert.ok(analysis.improved_outline.sample_bullet_rewrites.length > 0, 'Should offer bullet point rewrites');
});

test('Mock interview question generator provides structured criteria', async () => {
  const { questions } = await aiService.generateInterviewQuestions({
    role: 'Software Developer',
    category: 'technical',
    experienceLevel: 'Student / Fresher'
  });

  assert.strictEqual(questions.length, 5, 'Should generate 5 questions');
  assert.ok(questions[0].text, 'Question text must not be empty');
  assert.ok(questions[0].criteria, 'Question criteria must be specified');
});

test('Interview answer evaluation scores constructively', async () => {
  const evaluation = await aiService.evaluateInterviewAnswer({
    question: 'Explain the difference between process and thread.',
    answer: 'A process is an executing program with its own memory space, whereas a thread is a subset of a process sharing the heap with other threads of that process.',
    role: 'Software Developer',
    language: 'en'
  });

  assert.ok(evaluation.score >= 1.0 && evaluation.score <= 10.0, 'Score must be between 1 and 10');
  assert.ok(evaluation.strengths, 'Strengths must be populated');
  assert.ok(evaluation.improvements, 'Improvements must be populated');
  assert.ok(evaluation.model_answer, 'Model answer must be provided');
});
