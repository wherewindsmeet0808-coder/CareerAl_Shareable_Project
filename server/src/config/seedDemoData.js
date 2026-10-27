import { CURATED_ROLES, CURATED_RESOURCES } from '../data/curatedCareers.js';
import { calculateRoleMatch } from '../services/careerMatchingService.js';

export function seedDemoAccounts(store) {
  // 1. Seed Demo Admin Account
  const adminEmail = 'admin@aicareer.com';
  let adminUser = store.profiles.find((p) => p.email.toLowerCase() === adminEmail);
  if (!adminUser) {
    adminUser = {
      id: 'd0000000-0000-0000-0000-000000000001',
      email: adminEmail,
      full_name: 'Dr. Ramesh Kumar (Admin)',
      role: 'admin',
      education_level: 'Postgraduate',
      degree: 'Ph.D. in Computer Science',
      specialization: 'Artificial Intelligence & Career Systems',
      graduation_year: 2018,
      skills: ['System Architecture', 'PostgreSQL', 'AI Strategy', 'Leadership'],
      interests: ['Career Development', 'Engineering Education'],
      experience_level: 'Senior Professional',
      preferred_role: 'Administrator',
      preferred_location: 'India',
      preferred_work_mode: 'remote',
      preferred_language: 'en',
      password_hash: '$2a$10$StM2fo2m6iQ4ca17dzy1C.leAG7VAUXlusG7buxR1NkhZ0EeZUYGK', // Admin@2026
      created_at: new Date('2026-01-01').toISOString(),
      updated_at: new Date().toISOString()
    };
    store.profiles.push(adminUser);
  }

  // 2. Seed Demo Student Account
  const studentEmail = 'priya.sharma@example.edu';
  let studentUser = store.profiles.find((p) => p.email.toLowerCase() === studentEmail);
  if (!studentUser) {
    studentUser = {
      id: 'd0000000-0000-0000-0000-000000000002',
      email: studentEmail,
      full_name: 'Priya Sharma',
      role: 'student',
      education_level: 'Undergraduate',
      degree: 'B.Tech in Computer Science and Engineering',
      specialization: 'Computer Science',
      graduation_year: 2026,
      skills: ['JavaScript (ES6+)', 'TypeScript', 'React', 'Python', 'SQL', 'Git', 'Data Structures', 'HTML5', 'Tailwind CSS'],
      interests: ['Software Engineering', 'Artificial Intelligence & ML', 'Full Stack Web Development'],
      experience_level: 'Student / Fresher',
      preferred_role: 'Software Developer',
      preferred_location: 'Chennai / Bangalore / Remote',
      preferred_work_mode: 'hybrid',
      preferred_language: 'en',
      password_hash: '$2a$10$o5mIx8aO7uYFqMJ4SNBUseAumBMB6A545zl8cir47N6k/mkOHDcou', // Student@2026
      created_at: new Date('2026-02-15').toISOString(),
      updated_at: new Date().toISOString()
    };
    store.profiles.push(studentUser);

    // Seed Priya's assessment
    const assessmentId = 'd0000000-0000-0000-0000-000000000003';
    store.career_assessments.push({
      id: assessmentId,
      user_id: studentUser.id,
      education: studentUser.degree,
      technical_skills: studentUser.skills,
      soft_skills: ['Problem Solving', 'Team Collaboration', 'Debugging Persistence'],
      interests: studentUser.interests,
      experience_level: 'Student / Fresher',
      projects_and_certifications: 'Built full-stack book store with React and Express; completed Python on Coursera.',
      preferred_work_mode: 'hybrid',
      career_goals: 'Aspiring to join an innovative product engineering company as a software developer.',
      created_at: new Date('2026-02-16').toISOString()
    });

    // Seed Priya's Recommendations
    const softwareRole = CURATED_ROLES[0];
    const webRole = CURATED_ROLES[4];
    const aiRole = CURATED_ROLES[1];

    const rec1 = calculateRoleMatch(studentUser, softwareRole);
    const rec2 = calculateRoleMatch(studentUser, webRole);
    const rec3 = calculateRoleMatch(studentUser, aiRole);

    store.career_recommendations.push(
      { id: 'rec-1', assessment_id: assessmentId, user_id: studentUser.id, ...rec1, created_at: new Date().toISOString() },
      { id: 'rec-2', assessment_id: assessmentId, user_id: studentUser.id, ...rec2, created_at: new Date().toISOString() },
      { id: 'rec-3', assessment_id: assessmentId, user_id: studentUser.id, ...rec3, created_at: new Date().toISOString() }
    );

    // Seed Priya's Skill Progress
    const sampleSkills = [
      { skill_name: 'Java', priority: 'high', status: 'in_progress', progress_percent: 60, estimated_duration: '2-3 Weeks' },
      { skill_name: 'Python', priority: 'high', status: 'completed', progress_percent: 100, estimated_duration: 'Mastered' },
      { skill_name: 'Data Structures', priority: 'high', status: 'completed', progress_percent: 100, estimated_duration: 'Mastered' },
      { skill_name: 'Algorithms', priority: 'high', status: 'in_progress', progress_percent: 70, estimated_duration: '3-4 Weeks' },
      { skill_name: 'SQL', priority: 'medium', status: 'completed', progress_percent: 100, estimated_duration: 'Mastered' },
      { skill_name: 'Git', priority: 'medium', status: 'completed', progress_percent: 100, estimated_duration: 'Mastered' },
      { skill_name: 'REST APIs', priority: 'medium', status: 'in_progress', progress_percent: 50, estimated_duration: '1-2 Weeks' },
      { skill_name: 'Object-Oriented Programming', priority: 'low', status: 'completed', progress_percent: 100, estimated_duration: 'Mastered' }
    ];

    sampleSkills.forEach((sk, idx) => {
      store.skill_progress.push({
        id: `sp-${idx + 1}`,
        user_id: studentUser.id,
        target_role: 'Software Developer',
        category: 'technical',
        ...sk,
        learning_url: 'https://developer.mozilla.org',
        updated_at: new Date().toISOString()
      });
    });

    // Seed Priya's Learning Roadmap & Progress
    const roadmapId = 'd0000000-0000-0000-0000-000000000004';
    store.roadmap_progress.push(
      { id: 'rp-1', roadmap_id: roadmapId, user_id: studentUser.id, phase_index: 1, item_key: 'p1_c1', completed: true, updated_at: new Date().toISOString() },
      { id: 'rp-2', roadmap_id: roadmapId, user_id: studentUser.id, phase_index: 1, item_key: 'p1_c2', completed: true, updated_at: new Date().toISOString() },
      { id: 'rp-3', roadmap_id: roadmapId, user_id: studentUser.id, phase_index: 1, item_key: 'p1_c3', completed: true, updated_at: new Date().toISOString() },
      { id: 'rp-4', roadmap_id: roadmapId, user_id: studentUser.id, phase_index: 2, item_key: 'p2_c1', completed: true, updated_at: new Date().toISOString() },
      { id: 'rp-5', roadmap_id: roadmapId, user_id: studentUser.id, phase_index: 2, item_key: 'p2_c2', completed: false, updated_at: new Date().toISOString() }
    );

    // Seed Priya's Sample Resume Analysis
    store.resume_analyses.push({
      id: 'd0000000-0000-0000-0000-000000000005',
      user_id: studentUser.id,
      file_name: 'Priya_Sharma_Software_Resume.pdf',
      target_role: 'Software Developer',
      ats_score: 84,
      summary: 'Solid foundational profile with proven strengths in full-stack web development, Python scripting, and relational data modeling.',
      detected_skills: ['REACT', 'NODE.JS', 'JAVASCRIPT', 'TYPESCRIPT', 'PYTHON', 'SQL', 'GIT', 'HTML5', 'TAILWIND'],
      education_experience_summary: 'B.Tech Computer Science senior with coursework in Data Structures, Database Systems, and Web Engineering.',
      project_highlights: [
        'E-Commerce platform with React, Express, and SQLite with clean auth',
        'Algorithmic CLI Task Scheduler using Python'
      ],
      keywords_found: ['React', 'Node.js', 'Python', 'SQL', 'Git', 'REST API', 'Data Structures'],
      keywords_missing: ['Docker', 'AWS', 'CI/CD Pipelines', 'Unit Testing'],
      strengths: [
        'Clear project impact descriptions with GitHub repository links',
        'Strong technical core with modern programming languages',
        'Clean standard single-column ATS formatting'
      ],
      weaknesses: [
        'Lacks quantifiable engineering performance metrics (latency reduction, query times)',
        'Containerization and cloud deployment experience not explicitly highlighted'
      ],
      actionable_improvements: [
        'Incorporate Docker and CI/CD keywords into your project toolkits.',
        'Add quantitative metrics to your e-commerce project description (e.g. "Achieved 99.5% uptime").',
        'List automated unit tests written for your RESTful API microservice.'
      ],
      ats_feedback: {
        formatting: 'Excellent single-column layout adhering strictly to standard recruiter parsers.',
        keyword_density: 'Good density of core languages; consider adding DevOps terminology.',
        impact_phrasing: 'Action verbs like "Engineered", "Architected", and "Designed" used effectively.'
      },
      suggested_roles: ['Software Developer', 'Full Stack Developer', 'Junior Backend Engineer'],
      improved_outline: {
        suggested_headline: 'Software Developer | Specializing in React, Node.js & Distributed Data Systems',
        sample_bullet_rewrites: [
          {
            original: 'Built an e-commerce website using React and Node',
            improved: 'Architected responsive full-stack e-commerce portal supporting 50+ product listings with 200ms average query latency.'
          }
        ]
      },
      created_at: new Date().toISOString()
    });

    // Seed Priya's Sample Mock Interview Session
    store.mock_interview_sessions.push({
      id: 'd0000000-0000-0000-0000-000000000006',
      user_id: studentUser.id,
      target_role: 'Software Developer',
      experience_level: 'Student / Fresher',
      category: 'technical',
      questions: [
        { id: 1, text: 'Explain the difference between process and thread, and how memory is shared.' },
        { id: 2, text: 'What is the time complexity of searching in a balanced BST vs an unsorted array?' },
        { id: 3, text: 'How do RESTful APIs handle idempotency, and which HTTP methods are idempotent?' }
      ],
      overall_score: 8.3,
      overall_feedback: 'Demonstrated strong foundational knowledge of operating systems and database design.',
      status: 'completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Seed Priya's Tracked Jobs in Application Tracker
    store.saved_jobs.push(
      {
        id: 'job-seed-1',
        user_id: studentUser.id,
        job_id: 'starter-2',
        title: 'Frontend React Developer Intern',
        company: 'Freshworks Inc.',
        location: 'Chennai / Hybrid',
        work_mode: 'hybrid',
        apply_url: 'https://www.freshworks.com/company/careers/',
        skills: ['React', 'JavaScript', 'Tailwind CSS', 'REST APIs'],
        status: 'interviewing',
        notes: 'Technical round scheduled with engineering lead for Friday afternoon.',
        applied_date: '2026-10-22',
        created_at: new Date('2026-10-22').toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'job-seed-2',
        user_id: studentUser.id,
        job_id: 'starter-1',
        title: 'Junior Software Engineer (Fresher / 2026 Batch)',
        company: 'TCS Innovation Labs',
        location: 'Bengaluru / Hybrid',
        work_mode: 'hybrid',
        apply_url: 'https://www.tcs.com/careers/entry-level-hiring',
        skills: ['Java', 'SQL', 'Data Structures', 'Git'],
        status: 'applied',
        notes: 'Applied through campus drive referral portal.',
        applied_date: '2026-10-20',
        created_at: new Date('2026-10-20').toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'job-seed-3',
        user_id: studentUser.id,
        job_id: 'starter-3',
        title: 'Data Analyst Trainee',
        company: 'Zoho Corporation',
        location: 'Tenkasi / Chennai / Onsite',
        work_mode: 'onsite',
        apply_url: 'https://www.zoho.com/careers/',
        skills: ['SQL', 'Python', 'Excel', 'Data Visualization'],
        status: 'bookmarked',
        notes: 'Reviewing SQL questions before submitting application.',
        applied_date: null,
        created_at: new Date('2026-10-24').toISOString(),
        updated_at: new Date().toISOString()
      }
    );
  }
}
