import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { db } from '../config/db.js';
import { CURATED_ROLES } from '../data/curatedCareers.js';

const router = Router();

// Helper to generate the 6-phase roadmap tailored to target role and student level
function buildRoadmapForRole(roleTitle, studentSkills = []) {
  const role = CURATED_ROLES.find((r) => r.title.toLowerCase() === roleTitle.toLowerCase()) || CURATED_ROLES[0];
  const userSkillsLower = (studentSkills || []).map((s) => s.toLowerCase());

  return [
    {
      phase: 1,
      title: 'Phase 1: Fundamentals & Computer Science Core',
      duration: '4 - 6 Weeks (Estimated)',
      objective: `Build an unbreakable foundation in problem solving, algorithms, and core languages required for ${role.title}.`,
      topics: [
        'Memory management, time and space complexity (Big-O notation)',
        'Data Structures: Arrays, Linked Lists, Stacks, Queues, Hash Tables',
        'Object-Oriented Programming (OOP) and Modular Code Organization',
        'Git version control and command line navigation'
      ],
      practical_tasks: [
        'Solve 25 beginner algorithmic problems on LeetCode/NeetCode in your chosen language',
        'Initialize a GitHub profile and push clean, well-commented code daily'
      ],
      project: {
        title: 'Algorithmic Problem Bank & CLI Utility',
        description: 'Create a command-line application that implements fundamental data structures from scratch.'
      },
      resources: [
        { name: 'CS50x: Intro to Computer Science', url: 'https://cs50.harvard.edu/x/', provider: 'Harvard' },
        { name: 'Git & GitHub Complete Guide', url: 'https://skills.github.com/', provider: 'GitHub' }
      ],
      checklist: [
        { key: 'p1_c1', label: 'Understand Big-O time and space complexity' },
        { key: 'p1_c2', label: 'Implement Arrays, Hash Tables, and Linked Lists from scratch' },
        { key: 'p1_c3', label: 'Master Git branching, commits, and pull requests' }
      ]
    },
    {
      phase: 2,
      title: 'Phase 2: Core Technical Specialization',
      duration: '6 - 8 Weeks (Estimated)',
      objective: `Deep-dive into the primary technologies and frameworks used daily by ${role.title}s.`,
      topics: role.required_technical_skills.slice(0, 4).map((skill) => `Deep dive into ${skill} concepts, design patterns, and idiomatic practices`),
      practical_tasks: [
        `Build 2 focused mini-apps exercising ${role.required_technical_skills[0]} and ${role.required_technical_skills[1]}`,
        'Implement automated testing and relational/non-relational database models'
      ],
      project: {
        title: role.beginner_projects[0]?.title || 'Core Specialization Service',
        description: role.beginner_projects[0]?.desc || 'A full-fledged service exercising the primary technical stack.'
      },
      resources: [
        { name: 'freeCodeCamp Certification Track', url: 'https://www.freecodecamp.org/learn', provider: 'freeCodeCamp' },
        { name: 'Official Language Documentation', url: 'https://developer.mozilla.org/en-US/', provider: 'MDN Web Docs' }
      ],
      checklist: [
        { key: 'p2_c1', label: `Complete core tutorials for ${role.required_technical_skills[0]}` },
        { key: 'p2_c2', label: 'Design and query a normalized SQL/NoSQL database schema' },
        { key: 'p2_c3', label: 'Write unit tests validating critical edge cases' }
      ]
    },
    {
      phase: 3,
      title: 'Phase 3: Real-World Practical Projects',
      duration: '4 - 6 Weeks (Estimated)',
      objective: 'Build comprehensive, production-grade applications that solve genuine problems and showcase architectural competence.',
      topics: [
        'Secure user authentication (JWT / OAuth2 / Sessions)',
        'RESTful API architecture and clean separation of concerns',
        'State management, caching, and error resilience',
        'Security best practices (OWASP Top 10)'
      ],
      practical_tasks: [
        'Build a capstone application featuring full CRUD, search, filter, and pagination',
        'Deploy the project on modern cloud providers (Vercel, Render, Railway, AWS)'
      ],
      project: {
        title: role.beginner_projects[1]?.title || 'Production Capstone Platform',
        description: role.beginner_projects[1]?.desc || 'A complete, deployed application with auth and database persistence.'
      },
      resources: [
        { name: 'Full Stack Open Curriculum', url: 'https://fullstackopen.com/en/', provider: 'University of Helsinki' },
        { name: 'OWASP Security Essentials', url: 'https://owasp.org/www-project-top-ten/', provider: 'OWASP' }
      ],
      checklist: [
        { key: 'p3_c1', label: 'Complete Capstone Application with working authentication' },
        { key: 'p3_c2', label: 'Deploy application live on the web with accessible URL' },
        { key: 'p3_c3', label: 'Document API endpoints and architecture in README' }
      ]
    },
    {
      phase: 4,
      title: 'Phase 4: Portfolio, GitHub & Public Proof-of-Work',
      duration: '2 - 3 Weeks (Estimated)',
      objective: 'Package your projects professionally so hiring managers and senior engineers can evaluate your skills within 60 seconds.',
      topics: [
        'Writing compelling GitHub READMEs with architecture diagrams and demo GIFs',
        'Creating a fast, mobile-responsive developer portfolio website',
        'Clean code hygiene: linting, formatting, and informative commit history'
      ],
      practical_tasks: [
        'Pin your top 3 repositories on GitHub with informative READMEs',
        'Publish your portfolio website showcasing live links and tech stacks'
      ],
      project: {
        title: 'Developer Portfolio & Case Study Showcase',
        description: 'A polished personal site detailing your journey, projects, tech skills, and contact links.'
      },
      resources: [
        { name: 'GitHub Profile README Generator', url: 'https://rahuldkjain.github.io/gh-profile-readme-generator/', provider: 'Open Source' }
      ],
      checklist: [
        { key: 'p4_c1', label: 'Create professional GitHub README for all featured projects' },
        { key: 'p4_c2', label: 'Deploy personal developer portfolio website' },
        { key: 'p4_c3', label: 'Verify all project demo links are live and functional' }
      ]
    },
    {
      phase: 5,
      title: 'Phase 5: Resume Preparation & ATS Optimization',
      duration: '1 - 2 Weeks (Estimated)',
      objective: 'Synthesize your achievements into a high-scoring, ATS-compliant 1-page resume tailored for hiring software.',
      topics: [
        'ATS formatting rules: single-column layout, standard headers, no graphics',
        'Action verbs and quantifiable metrics (Google XYZ format)',
        'Customizing keywords for specific job postings'
      ],
      practical_tasks: [
        'Upload your draft resume into the AI Resume Analyzer to obtain an ATS score > 80%',
        'Incorporate the suggested bullet point rewrites and missing technical keywords'
      ],
      project: {
        title: 'Targeted Professional Tech Resume',
        description: 'A 1-page ATS-optimized resume emphasizing production projects, skills, and education.'
      },
      resources: [
        { name: 'Harvard Mignone Center Resume Guide', url: 'https://careerservices.fas.harvard.edu/', provider: 'Harvard' }
      ],
      checklist: [
        { key: 'p5_c1', label: 'Run resume through the AI Resume Analyzer' },
        { key: 'p5_c2', label: 'Rewrite bullet points using quantifiable metrics' },
        { key: 'p5_c3', label: 'Export clean PDF and verify text selectability' }
      ]
    },
    {
      phase: 6,
      title: 'Phase 6: Interview Practice & Job Applications',
      duration: 'Ongoing (4 - 8 Weeks)',
      objective: 'Practice technical and behavioral interviews, track applications, and secure student/fresher offers.',
      topics: [
        'STAR method for behavioral questions',
        'Technical whiteboard and coding interview communication',
        'Application tracking and professional follow-ups'
      ],
      practical_tasks: [
        'Complete at least 5 mock interview sessions using our AI Mock Interview module',
        'Submit 5-10 tailored applications weekly and track status in the Job Application Tracker'
      ],
      project: {
        title: 'Active Job Search Campaign',
        description: 'Systematic application strategy with follow-ups, networking, and interview reviews.'
      },
      resources: [
        { name: 'Tech Interview Handbook', url: 'https://www.techinterviewhandbook.org/', provider: 'Yangshun Tay' }
      ],
      checklist: [
        { key: 'p6_c1', label: 'Complete 5 AI Mock Interview sessions with score >= 7.5' },
        { key: 'p6_c2', label: 'Save and apply to 10 verified fresher openings in Job Tracker' },
        { key: 'p6_c3', label: 'Send professional networking messages on LinkedIn' }
      ]
    }
  ];
}

// Get or Generate Learning Roadmap
router.get('/', requireAuth, async (req, res) => {
  try {
    const targetRole = req.query.role || req.user.preferred_role || 'Software Developer';

    let roadmap = await db.getLearningRoadmap(req.user.id, targetRole);

    if (!roadmap) {
      const generatedPhases = buildRoadmapForRole(targetRole, req.user.skills);
      roadmap = await db.saveLearningRoadmap(req.user.id, targetRole, generatedPhases);
    }

    // Fetch user's completion progress
    const progressList = await db.getRoadmapProgress(req.user.id, roadmap.id);
    const progressMap = {};
    progressList.forEach((p) => {
      progressMap[p.item_key] = p.completed;
    });

    // Compute overall completion percentage
    let totalItems = 0;
    let completedItems = 0;
    roadmap.phases.forEach((phase) => {
      phase.checklist.forEach((item) => {
        totalItems++;
        if (progressMap[item.key]) {
          completedItems++;
        }
      });
    });

    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    res.json({
      success: true,
      roadmapId: roadmap.id,
      target_role: targetRole,
      phases: roadmap.phases,
      progress: progressMap,
      stats: {
        totalItems,
        completedItems,
        completionPercentage
      }
    });
  } catch (err) {
    console.error('Roadmap error:', err);
    res.status(500).json({ success: false, error: 'Failed to load learning roadmap.' });
  }
});

// Toggle Roadmap Checklist Item
router.post('/toggle-item', requireAuth, async (req, res) => {
  try {
    const { roadmapId, phaseIndex, itemKey, completed } = req.body;
    if (!roadmapId || !itemKey) {
      return res.status(400).json({ success: false, error: 'roadmapId and itemKey are required.' });
    }

    const updated = await db.updateRoadmapItemStatus(
      req.user.id,
      roadmapId,
      phaseIndex !== undefined ? Number(phaseIndex) : 1,
      itemKey,
      Boolean(completed)
    );

    res.json({
      success: true,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update checklist item.' });
  }
});

export default router;
