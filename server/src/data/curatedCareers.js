export const CURATED_ROLES = [
  {
    id: 'a1111111-1111-1111-1111-111111111101',
    title: 'Software Developer',
    category: 'Software Engineering',
    description: 'Designs, builds, and maintains robust backend systems, APIs, and business applications using modern programming principles.',
    required_technical_skills: ['Java', 'Python', 'Data Structures', 'Algorithms', 'Git', 'REST APIs', 'SQL', 'Object-Oriented Programming'],
    required_soft_skills: ['Problem Solving', 'Team Collaboration', 'Debugging Persistence', 'Clear Communication'],
    suitable_degrees: ['Computer Science', 'Information Technology', 'Software Engineering', 'Electronics & Communication', 'BCA/MCA'],
    beginner_projects: [
      { title: 'CLI Task & Expense Manager', desc: 'Build an interactive command-line app with file/SQLite storage and CRUD commands.' },
      { title: 'RESTful Inventory API', desc: 'Create a Node.js/Python microservice with JWT auth, database persistence, and documentation.' },
      { title: 'URL Shortener with Analytics', desc: 'Design an efficient redirect service tracking click counts, timestamps, and referrers.' }
    ],
    market_demand: 'Very High',
    avg_salary_range: '₹6,00,000 - ₹14,00,000 / $75,000 - $125,000'
  },
  {
    id: 'a1111111-1111-1111-1111-111111111102',
    title: 'AI/ML Engineer',
    category: 'Artificial Intelligence & Data',
    description: 'Develops and productionizes machine learning models, neural networks, and generative AI pipelines for predictive and intelligent systems.',
    required_technical_skills: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Linear Algebra', 'Data Preprocessing', 'FastAPI', 'LLM APIs'],
    required_soft_skills: ['Analytical Thinking', 'Research Mindset', 'Experimental Rigor', 'Data Storytelling'],
    suitable_degrees: ['Computer Science', 'Artificial Intelligence', 'Data Science', 'Mathematics', 'Statistics'],
    beginner_projects: [
      { title: 'Customer Churn Predictor', desc: 'Train and tune a classifier on customer behavior data with precision/recall trade-off analysis.' },
      { title: 'Document Q&A RAG System', desc: 'Build a retrieval-augmented generation app using Gemini and vector embeddings for PDF search.' },
      { title: 'Transfer Learning Image Classifier', desc: 'Fine-tune a ResNet model to categorize defective components or medical scans.' }
    ],
    market_demand: 'Extremely High',
    avg_salary_range: '₹8,00,000 - ₹20,00,000 / $95,000 - $160,000'
  },
  {
    id: 'a1111111-1111-1111-1111-111111111103',
    title: 'Data Analyst',
    category: 'Data & Business Intelligence',
    description: 'Translates raw tabular data into executive dashboards, KPIs, and actionable insights to guide business strategies.',
    required_technical_skills: ['SQL', 'Python', 'Excel & Spreadsheets', 'Power BI', 'Tableau', 'Exploratory Data Analysis', 'Statistics'],
    required_soft_skills: ['Storytelling with Data', 'Attention to Detail', 'Business Acumen', 'Curiosity'],
    suitable_degrees: ['Computer Science', 'Information Systems', 'Economics', 'Commerce', 'Business Administration', 'BBA/BCA'],
    beginner_projects: [
      { title: 'Executive Sales Performance Dashboard', desc: 'Clean e-commerce dataset, compute sales velocities, and build interactive Power BI charts.' },
      { title: 'E-Commerce Churn & Retention Analysis', desc: 'Segment customer cohorts using SQL and write a managerial report with visual charts.' },
      { title: 'Regional Healthcare Trends Explorer', desc: 'Analyze open public health records using Python Pandas and Matplotlib/Seaborn.' }
    ],
    market_demand: 'High',
    avg_salary_range: '₹5,00,000 - ₹11,00,000 / $65,000 - $100,000'
  },
  {
    id: 'a1111111-1111-1111-1111-111111111104',
    title: 'Data Scientist',
    category: 'Artificial Intelligence & Data',
    description: 'Combines statistical modeling, data engineering, and machine learning to uncover deep patterns and build automated predictive engines.',
    required_technical_skills: ['Python', 'R', 'SQL', 'Statistical Modeling', 'Machine Learning', 'A/B Testing', 'Pandas', 'NumPy'],
    required_soft_skills: ['Critical Thinking', 'Hypothesis Testing', 'Scientific Communication', 'Domain Knowledge'],
    suitable_degrees: ['Computer Science', 'Data Science', 'Statistics', 'Mathematics', 'Physics', 'Quantitative Engineering'],
    beginner_projects: [
      { title: 'Credit Risk Scoring Engine', desc: 'Build an interpretable logistic regression and XGBoost model evaluating loan default probability.' },
      { title: 'Movie Recommendation Engine', desc: 'Implement collaborative filtering and matrix factorization on the MovieLens dataset.' },
      { title: 'Time-Series Demand Forecaster', desc: 'Forecast retail store demand using ARIMA and Prophet with cross-validation.' }
    ],
    market_demand: 'Very High',
    avg_salary_range: '₹7,50,000 - ₹18,00,000 / $90,000 - $145,000'
  },
  {
    id: 'a1111111-1111-1111-1111-111111111105',
    title: 'Web Developer',
    category: 'Web & Cloud Systems',
    description: 'Builds responsive, performant, and accessible full-stack web applications from interactive client UIs to server-side APIs.',
    required_technical_skills: ['HTML5', 'CSS3 / Tailwind', 'JavaScript (ES6+)', 'TypeScript', 'React', 'Node.js', 'Express', 'REST APIs'],
    required_soft_skills: ['User Empathy', 'Visual Aesthetics', 'Responsive Design Mindset', 'Teamwork'],
    suitable_degrees: ['Computer Science', 'Information Technology', 'Web Development', 'Any Engineering or Science Graduate'],
    beginner_projects: [
      { title: 'Modern E-Commerce Storefront', desc: 'Build a catalog, shopping cart, checkout flow with filterable categories and responsive layout.' },
      { title: 'Collaborative Real-Time Workspace', desc: 'Develop a kanban board or markdown editor with live synchronization and persistent storage.' },
      { title: 'Dev Community Forum App', desc: 'Create post creation, voting, nested replies, user authentication, and profile badges.' }
    ],
    market_demand: 'High',
    avg_salary_range: '₹5,00,000 - ₹12,00,000 / $70,000 - $115,000'
  },
  {
    id: 'a1111111-1111-1111-1111-111111111106',
    title: 'Cybersecurity Analyst',
    category: 'Security & Infrastructure',
    description: 'Guards networks, applications, and cloud environments against breaches, performs threat assessments, and responds to incidents.',
    required_technical_skills: ['Networking (TCP/IP)', 'Linux CLI', 'Vulnerability Scanning', 'Wireshark', 'SIEM Tools', 'Cryptography Basics', 'Security Auditing'],
    required_soft_skills: ['Vigilance', 'Ethical Integrity', 'Crisis Calmness', 'Analytical Investigation'],
    suitable_degrees: ['Cybersecurity', 'Computer Science', 'Information Technology', 'Network Engineering'],
    beginner_projects: [
      { title: 'Home Lab Network Vulnerability Assessment', desc: 'Set up vulnerable VMs (Metasploitable) and conduct safe port scanning and vulnerability reporting.' },
      { title: 'Snort/Suricata Intrusion Detection Setup', desc: 'Configure an open-source IDS to inspect packet captures and trigger alerts on simulated attacks.' },
      { title: 'Automated Log Analyzer in Python', desc: 'Parse Nginx/Apache auth logs to identify brute-force login attempts and generate IP blocklists.' }
    ],
    market_demand: 'Very High',
    avg_salary_range: '₹6,50,000 - ₹15,00,000 / $80,000 - $130,000'
  },
  {
    id: 'a1111111-1111-1111-1111-111111111107',
    title: 'Cloud Engineer',
    category: 'Cloud & DevOps',
    description: 'Deploys and optimizes resilient cloud infrastructure, automates containerized deployments, and monitors cloud reliability.',
    required_technical_skills: ['AWS / Azure / GCP', 'Docker', 'Kubernetes', 'Linux Administration', 'Terraform', 'CI/CD Pipelines', 'Networking & DNS'],
    required_soft_skills: ['Systems Thinking', 'Automation Mindset', 'Cost Consciousness', 'High Reliability Focus'],
    suitable_degrees: ['Computer Science', 'Information Technology', 'Cloud Computing', 'Electronics'],
    beginner_projects: [
      { title: 'Infrastructure-as-Code Web Cluster', desc: 'Provision a load balancer, VPC, and auto-scaling EC2 instances using Terraform.' },
      { title: 'Containerized Microservice on Kubernetes', desc: 'Dockerize a multi-tier app and write Kubernetes Deployments, Services, and Ingress manifests.' },
      { title: 'Automated CI/CD Pipeline', desc: 'Create a GitHub Actions workflow testing code, building Docker images, and deploying to AWS/GCP.' }
    ],
    market_demand: 'Very High',
    avg_salary_range: '₹7,00,000 - ₹16,00,000 / $85,000 - $140,000'
  },
  {
    id: 'a1111111-1111-1111-1111-111111111108',
    title: 'UI/UX Designer',
    category: 'Design & Product Experience',
    description: 'Crafts intuitive, visually polished digital experiences through user research, wireframing, component libraries, and usability testing.',
    required_technical_skills: ['Figma', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems', 'Usability Testing', 'Information Architecture', 'HTML/CSS Basics'],
    required_soft_skills: ['Empathy', 'Visual Communication', 'Active Listening', 'Design Critique Receptivity'],
    suitable_degrees: ['Design', 'Human-Computer Interaction', 'Computer Science', 'Fine Arts', 'Psychology'],
    beginner_projects: [
      { title: 'Mobile Banking App Redesign Case Study', desc: 'Identify UX pain points in existing banking apps and design a polished, accessible Figma flow.' },
      { title: 'B2B SaaS Design System', desc: 'Build a comprehensive tokenized component library with auto-layout, variants, and dark mode in Figma.' },
      { title: 'Student Learning Platform Prototype', desc: 'Conduct interviews with 5 students, map user journeys, and create clickable high-fidelity prototypes.' }
    ],
    market_demand: 'High',
    avg_salary_range: '₹5,00,000 - ₹13,00,000 / $70,000 - $115,000'
  },
  {
    id: 'a1111111-1111-1111-1111-111111111109',
    title: 'Business Analyst',
    category: 'Business & Product Strategy',
    description: 'Translates high-level business goals into functional engineering specifications, user stories, and process optimization models.',
    required_technical_skills: ['Requirements Gathering', 'Agile / Scrum', 'JIRA', 'Process Mapping (BPMN)', 'SQL Basics', 'Data Analysis', 'User Stories Writing'],
    required_soft_skills: ['Stakeholder Management', 'Negotiation', 'Clarity in Communication', 'Strategic Thinking'],
    suitable_degrees: ['Business Administration', 'Information Systems', 'Computer Science', 'Commerce', 'Engineering'],
    beginner_projects: [
      { title: 'FinTech App Business Requirements Document (BRD)', desc: 'Write comprehensive functional specifications, acceptance criteria, and edge cases.' },
      { title: 'As-Is vs To-Be Process Workflow Map', desc: 'Model an existing customer onboarding pipeline and present an optimized BPMN flow.' },
      { title: 'Feature Prioritization Matrix', desc: 'Analyze competitive SaaS products and build an impact-vs-effort scoring matrix for product teams.' }
    ],
    market_demand: 'Moderate to High',
    avg_salary_range: '₹6,00,000 - ₹13,00,000 / $75,000 - $110,000'
  },
  {
    id: 'a1111111-1111-1111-1111-111111111110',
    title: 'QA Engineer',
    category: 'Quality Assurance & Testing',
    description: 'Ensures software quality, stability, and speed by designing automated test suites, executing stress tests, and tracking bugs.',
    required_technical_skills: ['Selenium', 'Cypress / Playwright', 'Postman / API Testing', 'JavaScript / Python', 'Test Case Authoring', 'JIRA', 'Git'],
    required_soft_skills: ['Meticulous Attention', 'Bug Advocacy', 'Constructive Questioning', 'Patience'],
    suitable_degrees: ['Computer Science', 'Information Technology', 'Software Engineering', 'Any Engineering Graduate'],
    beginner_projects: [
      { title: 'Automated E2E Testing Suite with Playwright', desc: 'Write automated browser test scripts verifying registration, cart additions, and payment checkout.' },
      { title: 'Automated API Test Collection in Postman', desc: 'Build test scripts validating status codes, response times, and schema assertions for public APIs.' },
      { title: 'Performance Load Benchmark with k6', desc: 'Simulate concurrent user traffic on a sample web app and analyze latency and error rates.' }
    ],
    market_demand: 'Moderate to High',
    avg_salary_range: '₹4,50,000 - ₹10,50,000 / $65,000 - $105,000'
  }
];

export const CURATED_RESOURCES = [
  { skill: 'JavaScript (ES6+)', title: 'MDN JavaScript Guide & Reference', provider: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', is_free: true, level: 'beginner' },
  { skill: 'React', title: 'React Official Documentation & Interactive Tour', provider: 'React.dev', url: 'https://react.dev/learn', is_free: true, level: 'beginner' },
  { skill: 'React', title: 'Full Modern React Course', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/learn-react-by-building-apps/', is_free: true, level: 'beginner' },
  { skill: 'Python', title: 'Python for Everybody Specialization', provider: 'freeCodeCamp / Coursera', url: 'https://www.freecodecamp.org/news/python-for-everybody/', is_free: true, level: 'beginner' },
  { skill: 'Data Structures', title: 'CS50: Introduction to Computer Science', provider: 'Harvard / edX', url: 'https://cs50.harvard.edu/x/', is_free: true, level: 'beginner' },
  { skill: 'Algorithms', title: 'NeetCode Algorithm Roadmaps', provider: 'NeetCode.io', url: 'https://neetcode.io/roadmap', is_free: true, level: 'intermediate' },
  { skill: 'SQL', title: 'SQL Tutorial & Interactive Practice', provider: 'SQLZoo', url: 'https://sqlzoo.net/', is_free: true, level: 'beginner' },
  { skill: 'Git', title: 'Introduction to GitHub & Git CLI', provider: 'GitHub Skills', url: 'https://skills.github.com/', is_free: true, level: 'beginner' },
  { skill: 'Docker', title: 'Docker Official Getting Started Guide', provider: 'Docker Docs', url: 'https://docs.docker.com/get-started/', is_free: true, level: 'intermediate' },
  { skill: 'AWS / Azure / GCP', title: 'AWS Cloud Essentials Digital Course', provider: 'AWS Skill Builder', url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/', is_free: true, level: 'beginner' },
  { skill: 'Figma', title: 'Figma for Beginners UI Design System', provider: 'Figma Learn', url: 'https://help.figma.com/hc/en-us/categories/360002051613-Figma-for-beginners', is_free: true, level: 'beginner' },
  { skill: 'PyTorch', title: 'PyTorch Official 60-Minute Blitz & Tutorials', provider: 'PyTorch.org', url: 'https://pytorch.org/tutorials/', is_free: true, level: 'intermediate' },
  { skill: 'Scikit-Learn', title: 'Machine Learning with Python & Scikit-Learn', provider: 'Scikit-Learn Docs', url: 'https://scikit-learn.org/stable/tutorial/index.html', is_free: true, level: 'intermediate' },
  { skill: 'CSS3 / Tailwind', title: 'Tailwind CSS Official Core Concepts', provider: 'Tailwind CSS Docs', url: 'https://tailwindcss.com/docs/utility-first', is_free: true, level: 'beginner' },
  { skill: 'Cypress / Playwright', title: 'Playwright Fast & Reliable E2E Testing', provider: 'Playwright Docs', url: 'https://playwright.dev/docs/intro', is_free: true, level: 'beginner' },
  { skill: 'Networking (TCP/IP)', title: 'Computer Networking Basics', provider: 'Khan Academy', url: 'https://www.khanacademy.org/computing/computers-and-internet-analyzing-data', is_free: true, level: 'beginner' }
];

export const MOCK_INTERVIEW_QUESTIONS_BANK = {
  'Software Developer': {
    technical: [
      { id: 1, text: 'Explain the difference between process and thread, and how memory is shared between them.', criteria: 'Memory space separation, thread stack vs heap, context switching overhead.' },
      { id: 2, text: 'What is the time and space complexity of searching in a balanced Binary Search Tree vs an unsorted array?', criteria: 'O(log N) vs O(N) time complexity, tree balancing rationale.' },
      { id: 3, text: 'How do RESTful APIs handle idempotency, and which HTTP methods are idempotent?', criteria: 'GET, PUT, DELETE are idempotent; POST is not. Explanation of duplicate requests.' },
      { id: 4, text: 'Explain the ACID properties of relational databases with a real banking transfer example.', criteria: 'Atomicity, Consistency, Isolation, Durability with rollback scenario.' },
      { id: 5, text: 'How does garbage collection work in languages like Java or Node.js?', criteria: 'Mark and sweep, reference counts, generation phases, memory leak prevention.' }
    ],
    behavioral: [
      { id: 1, text: 'Tell me about a challenging bug you encountered in a project and how you diagnosed and resolved it.', criteria: 'STAR method, logging/debugging techniques, root cause analysis, prevention.' },
      { id: 2, text: 'Describe a situation where you had to work with a teammate who had a different architectural opinion.', criteria: 'Active listening, objective trade-off evaluation, constructive consensus.' },
      { id: 3, text: 'How do you prioritize tasks when you have multiple tight deadlines for college or project work?', criteria: 'Urgent vs important matrix, communication with stakeholders, iterative delivery.' }
    ],
    hr: [
      { id: 1, text: 'Why do you want to start your career as a Software Developer, and what type of products excite you?', criteria: 'Passion for engineering, learning trajectory, alignment with tech industry.' },
      { id: 2, text: 'Where do you see yourself technically and professionally in the next three years?', criteria: 'Skill mastery goals, mentorship aspirations, realistic progression path.' }
    ]
  },
  'AI/ML Engineer': {
    technical: [
      { id: 1, text: 'What is the bias-variance tradeoff, and how do techniques like regularization address overfitting?', criteria: 'High bias = underfitting, high variance = overfitting; L1/L2 regularization and dropout.' },
      { id: 2, text: 'Explain the difference between precision and recall. In what scenario would you prioritize recall over precision?', criteria: 'False positives vs false negatives; medical diagnosis or fraud detection requires high recall.' },
      { id: 3, text: 'How does the attention mechanism in Transformers improve upon traditional RNNs/LSTMs?', criteria: 'Parallelization across sequence tokens, resolving vanishing gradients, global context.' },
      { id: 4, text: 'Describe the steps you take when preparing a dataset with missing values and skewed numeric distributions.', criteria: 'Imputation strategies (median/mode/KNN), log transform or box-cox, scaling (StandardScaler/MinMax).' }
    ],
    behavioral: [
      { id: 1, text: 'Describe an ML experiment or model you built that did not achieve the expected accuracy, and what you learned.', criteria: 'STAR structure, data quality review, hyperparameter search, learning insight.' }
    ],
    hr: [
      { id: 1, text: 'AI is advancing at lightning speed. How do you stay updated with research papers and new model architectures?', criteria: 'ArXiv, HuggingFace, technical blogs, continuous hands-on prototyping.' }
    ]
  },
  'Web Developer': {
    technical: [
      { id: 1, text: 'Explain the event loop in JavaScript and how asynchronous operations like Promises and setTimeout are handled.', criteria: 'Call stack, Task queue, Microtask queue, Event loop tick.' },
      { id: 2, text: 'What are the main advantages of React Virtual DOM and how does reconciliation work?', criteria: 'Diffing algorithm, state updates, minimizing direct DOM repaints, keys in lists.' },
      { id: 3, text: 'How do you optimize the loading speed and Core Web Vitals of a modern web page?', criteria: 'Code splitting, lazy loading images, CDN caching, tree shaking, CSS purging.' }
    ],
    behavioral: [
      { id: 1, text: 'Tell me about a web project where you had to balance design aesthetics with mobile responsiveness and usability.', criteria: 'Mobile-first design, media queries, accessibility testing, user empathy.' }
    ],
    hr: [
      { id: 1, text: 'Why did you choose web development, and what makes a great user experience in your eyes?', criteria: 'User satisfaction, rapid feedback loop, modern web ecosystem passion.' }
    ]
  }
};
