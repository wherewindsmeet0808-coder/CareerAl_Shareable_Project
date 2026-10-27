import test from 'node:test';
import assert from 'node:assert';
import { calculateRoleMatch, generateRecommendations } from '../src/services/careerMatchingService.js';
import { CURATED_ROLES } from '../src/data/curatedCareers.js';

test('calculateRoleMatch correctly evaluates matching technical skills', () => {
  const role = CURATED_ROLES[0]; // Software Developer (Java, Python, SQL, etc.)
  const profile = {
    technical_skills: ['Java', 'SQL', 'Algorithms'],
    soft_skills: ['Problem Solving'],
    interests: ['Software Engineering'],
    education: 'Computer Science',
    experience_level: 'Student / Fresher'
  };

  const match = calculateRoleMatch(profile, role);

  assert.ok(match.match_percentage > 40, 'Match percentage should reflect existing skills');
  assert.ok(match.matching_skills.includes('Java'), 'Java should be in matching skills');
  assert.ok(match.matching_skills.includes('SQL'), 'SQL should be in matching skills');
  assert.ok(match.missing_skills.length > 0, 'Missing skills should be identified');
  assert.ok(match.score_breakdown.technical_skills.score > 0, 'Technical score must be positive');
  assert.ok(match.score_breakdown.methodology_notice, 'Methodology notice should explain score nature');
});

test('generateRecommendations sorts roles descending by match percentage', () => {
  const webProfile = {
    technical_skills: ['HTML5', 'CSS3 / Tailwind', 'JavaScript (ES6+)', 'React'],
    soft_skills: ['User Empathy'],
    interests: ['Web Design'],
    education: 'Information Technology'
  };

  const recommendations = generateRecommendations(webProfile);

  assert.ok(recommendations.length > 0, 'Should return recommendations');
  // Top role should have high score
  assert.ok(recommendations[0].match_percentage >= recommendations[1].match_percentage, 'Should be sorted descending');
  assert.strictEqual(recommendations[0].role_title, 'Web Developer', 'Web Developer should be the top match for a web stack');
});
