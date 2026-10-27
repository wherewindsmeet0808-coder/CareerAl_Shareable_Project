-- ==========================================================
-- SEED DATA: CURATED CAREER ROLES & LEARNING RESOURCES
-- ==========================================================

INSERT INTO public.career_roles (id, title, category, description, required_technical_skills, required_soft_skills, suitable_degrees, beginner_projects, market_demand, avg_salary_range)
VALUES
(
  'a1111111-1111-1111-1111-111111111101',
  'Software Developer',
  'Software Engineering',
  'Designs, builds, and tests software applications, backend services, and APIs using modern languages and clean architecture.',
  '["Java", "Python", "Data Structures", "Algorithms", "Git", "REST APIs", "SQL", "Object-Oriented Programming"]'::jsonb,
  '["Problem Solving", "Team Collaboration", "Debugging Persistence", "Code Review Communication"]'::jsonb,
  '["Computer Science", "Information Technology", "Software Engineering", "Electronics & Communication"]'::jsonb,
  '["Task Manager CLI in Java/Python", "RESTful API with Auth and SQLite", "URL Shortener Microservice"]'::jsonb,
  'Very High',
  '₹6,00,000 - ₹14,00,000 / $75,000 - $125,000'
),
(
  'a1111111-1111-1111-1111-111111111102',
  'AI/ML Engineer',
  'Artificial Intelligence & Data',
  'Builds and deploys machine learning models, deep neural networks, and LLM applications to solve predictive and generative challenges.',
  '["Python", "PyTorch", "TensorFlow", "Scikit-Learn", "Linear Algebra", "Data Preprocessing", "HuggingFace", "FastAPI"]'::jsonb,
  '["Analytical Thinking", "Research Mindset", "Experimental Rigor", "Clear Visualization"]'::jsonb,
  '["Computer Science", "Artificial Intelligence", "Data Science", "Mathematics", "Statistics"]'::jsonb,
  '["Customer Churn Predictor", "Document Q&A RAG System with Gemini", "Image Classification using Transfer Learning"]'::jsonb,
  'Extremely High',
  '₹8,00,000 - ₹20,00,000 / $95,000 - $160,000'
),
(
  'a1111111-1111-1111-1111-111111111103',
  'Data Analyst',
  'Data & Business Intelligence',
  'Transforms raw datasets into business insights, dashboards, and executive reports using statistical analysis and visualization.',
  '["SQL", "Python", "Excel & Spreadsheets", "Power BI", "Tableau", "Exploratory Data Analysis", "Statistics"]'::jsonb,
  '["Storytelling with Data", "Attention to Detail", "Business Acumen", "Curiosity"]'::jsonb,
  '["Computer Science", "Information Systems", "Economics", "Commerce", "Business Administration"]'::jsonb,
  '["Sales Performance Interactive Dashboard", "E-Commerce Customer Behavior Analysis", "Regional Healthcare Metric Explorer"]'::jsonb,
  'High',
  '₹5,00,000 - ₹11,00,000 / $65,000 - $100,000'
),
(
  'a1111111-1111-1111-1111-111111111104',
  'Data Scientist',
  'Artificial Intelligence & Data',
  'Develops statistical models, machine learning pipelines, and experimentation frameworks to extract actionable intelligence from complex datasets.',
  '["Python", "R", "SQL", "Statistical Modeling", "Machine Learning", "A/B Testing", "Pandas", "NumPy"]'::jsonb,
  '["Critical Thinking", "Hypothesis Testing", "Domain Understanding", "Scientific Communication"]'::jsonb,
  '["Computer Science", "Data Science", "Statistics", "Mathematics", "Physics"]'::jsonb,
  '["Credit Risk Scoring Model", "Recommendation Engine with Collaborative Filtering", "Time-Series Stock/Weather Forecasting"]'::jsonb,
  'Very High',
  '₹7,50,000 - ₹18,00,000 / $90,000 - $145,000'
),
(
  'a1111111-1111-1111-1111-111111111105',
  'Web Developer',
  'Web & Cloud Systems',
  'Creates responsive, modern, user-friendly web applications, frontend user experiences, and server-side logic using modern web stacks.',
  '["HTML5", "CSS3 / Tailwind", "JavaScript (ES6+)", "TypeScript", "React", "Node.js", "Express", "REST APIs"]'::jsonb,
  '["User Empathy", "Visual Aesthetics", "Responsiveness Awareness", "Continuous Learning"]'::jsonb,
  '["Computer Science", "Information Technology", "Web Development", "Any Engineering or BCA/MCA"]'::jsonb,
  '["Interactive E-Commerce Storefront", "Full-Stack Collaborative Notes App", "Real-Time Chat Application with WebSockets"]'::jsonb,
  'High',
  '₹5,00,000 - ₹12,00,000 / $70,000 - $115,000'
),
(
  'a1111111-1111-1111-1111-111111111106',
  'Cybersecurity Analyst',
  'Security & Infrastructure',
  'Monitors systems, identifies vulnerabilities, mitigates security incidents, and enforces cyber defense standards across corporate infrastructure.',
  '["Networking (TCP/IP)", "Linux CLI", "Vulnerability Scanning", "Wireshark", "SIEM Tools", "Cryptography Basics", "Security Auditing"]'::jsonb,
  '["Vigilance", "Ethical Integrity", "Crisis Calmness", "Analytical Investigation"]'::jsonb,
  '["Cybersecurity", "Computer Science", "Information Technology", "Network Engineering"]'::jsonb,
  '["Home Lab Network Vulnerability Assessment", "Snort/Suricata Intrusion Detection Setup", "Automated Security Log Analyzer in Python"]'::jsonb,
  'Very High',
  '₹6,50,000 - ₹15,00,000 / $80,000 - $130,000'
),
(
  'a1111111-1111-1111-1111-111111111107',
  'Cloud Engineer',
  'Cloud & DevOps',
  'Architects, deploys, scales, and maintains cloud infrastructure, CI/CD pipelines, and serverless environments across AWS, Azure, and GCP.',
  '["AWS / Azure / GCP", "Docker", "Kubernetes", "Linux Administration", "Terraform", "CI/CD Pipelines", "Networking & DNS"]'::jsonb,
  '["Systems Thinking", "Cost Consciousness", "Automation Mindset", "Reliability Focus"]'::jsonb,
  '["Computer Science", "Information Technology", "Cloud Computing", "Electronics"]'::jsonb,
  '["Multi-Tier Cloud Web Architecture with Terraform", "Automated GitHub Actions CI/CD to AWS ECS", "Serverless Image Resizer Pipeline"]'::jsonb,
  'Very High',
  '₹7,00,000 - ₹16,00,000 / $85,000 - $140,000'
),
(
  'a1111111-1111-1111-1111-111111111108',
  'UI/UX Designer',
  'Design & Product Experience',
  'Researches user needs, crafts wireframes, designs polished design systems, and builds interactive prototypes for intuitive digital experiences.',
  '["Figma", "Wireframing", "Prototyping", "User Research", "Design Systems", "Usability Testing", "Information Architecture", "HTML/CSS Basics"]'::jsonb,
  '["Empathy", "Visual Communication", "Active Listening", "Design Critique Receptivity"]'::jsonb,
  '["Design", "Human-Computer Interaction", "Computer Science", "Fine Arts", "Psychology"]'::jsonb,
  '["Mobile Banking App Redesign Case Study", "B2B SaaS Dashboard Design System in Figma", "Accessible E-Learning Platform Prototype"]'::jsonb,
  'High',
  '₹5,00,000 - ₹13,00,000 / $70,000 - $115,000'
),
(
  'a1111111-1111-1111-1111-111111111109',
  'Business Analyst',
  'Business & Product Strategy',
  'Bridges the gap between business stakeholders and technical development teams by analyzing processes, gathering requirements, and modeling solutions.',
  '["Requirements Gathering", "Agile / Scrum", "JIRA", "Process Mapping (BPMN)", "SQL Basics", "Data Analysis", "User Stories Writing"]'::jsonb,
  '["Stakeholder Management", "Negotiation", "Clarity in Communication", "Strategic Thinking"]'::jsonb,
  '["Business Administration", "Information Systems", "Computer Science", "Commerce"]'::jsonb,
  '["Business Requirements Document (BRD) for FinTech App", "As-Is vs To-Be Process Workflow Map", "Competitor Feature Gap Analysis Matrix"]'::jsonb,
  'Moderate to High',
  '₹6,00,000 - ₹13,00,000 / $75,000 - $110,000'
),
(
  'a1111111-1111-1111-1111-111111111110',
  'QA Engineer',
  'Quality Assurance & Testing',
  'Guarantees software quality and reliability through automated test suites, manual exploratory testing, API testing, and performance benchmarking.',
  '["Selenium", "Cypress / Playwright", "Postman / API Testing", "JavaScript / Python", "Test Case Authoring", "JIRA", "Git"]'::jsonb,
  '["Meticulous Attention", "Bug Advocacy", "Constructive Questioning", "Patience"]'::jsonb,
  '["Computer Science", "Information Technology", "Any Engineering Degree"]'::jsonb,
  '["Automated E2E Test Suite for Web Store using Cypress", "REST API Automated Test Collection in Postman", "Performance Load Test Report using k6"]'::jsonb,
  'Moderate to High',
  '₹4,50,000 - ₹10,50,000 / $65,000 - $105,000'
)
ON CONFLICT (title) DO NOTHING;

-- INSERT LEARNING RESOURCES
INSERT INTO public.learning_resources (title, skill, provider, url, is_free, level) VALUES
('JavaScript Guide & Reference', 'JavaScript (ES6+)', 'MDN Web Docs', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', true, 'beginner'),
('Full Modern React Course', 'React', 'freeCodeCamp', 'https://www.freecodecamp.org/learn/front-end-development-libraries/#react', true, 'beginner'),
('Python for Everybody Specialization', 'Python', 'Coursera / freeCodeCamp', 'https://www.freecodecamp.org/news/python-for-everybody/', true, 'beginner'),
('CS50: Introduction to Computer Science', 'Algorithms', 'Harvard / edX', 'https://cs50.harvard.edu/x/', true, 'beginner'),
('Learn SQL Roadmap & Interactive Practice', 'SQL', 'SQLZoo / W3Schools', 'https://sqlzoo.net/', true, 'beginner'),
('Git and GitHub Starter Guide', 'Git', 'GitHub Skills', 'https://skills.github.com/', true, 'beginner'),
('Docker for Developers Tutorial', 'Docker', 'Docker Official Docs', 'https://docs.docker.com/get-started/', true, 'intermediate'),
('AWS Cloud Practitioner Fundamentals', 'AWS / Azure / GCP', 'AWS Skill Builder', 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/', true, 'beginner'),
('Figma for Beginners UI Design', 'Figma', 'Figma Official Learn', 'https://help.figma.com/hc/en-us/categories/360002051613-Figma-for-beginners', true, 'beginner'),
('Deep Learning with PyTorch', 'PyTorch', 'PyTorch Official Tutorials', 'https://pytorch.org/tutorials/', true, 'intermediate'),
('Google Data Analytics Professional Path', 'Data Analysis', 'Google / Coursera', 'https://grow.google/certificates/data-analytics/', false, 'beginner'),
('Web Security Basics & OWASP Top 10', 'Security Auditing', 'OWASP Foundation', 'https://owasp.org/www-project-top-ten/', true, 'intermediate'),
('Playwright Modern End-to-End Testing', 'Cypress / Playwright', 'Playwright Docs', 'https://playwright.dev/docs/intro', true, 'beginner')
ON CONFLICT DO NOTHING;
