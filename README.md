# 🚀 AI Career Guidance — Full-Stack Web Application

A modern, production-grade, responsive AI Career Guidance platform designed for college students, freshers, and job seekers. The application helps users discover suitable career paths, analyze skill gaps, follow personalized 6-phase learning roadmaps, practice mock interviews, optimize resumes against ATS filters, and explore real-world verified job opportunities in both **English** and **தமிழ் (Tamil)**.

---

## 🌟 Key Features

1. **Personalized AI Career Recommendations**
   - Multi-step interactive questionnaire covering education, technical skills, soft skills, interests, and career goals.
   - Transparent, configurable matching algorithm (Technical Skills 45%, Soft Skills & Interests 25%, Degree 15%, Experience 15%) with complete mathematical breakdown.
   - Identifies matching skills, missing skills, why the role is suitable, recommended beginner projects, and credible learning links.
   - Dynamic recalculation when profile or assessment answers change.

2. **AI Skill Gap Visual Analysis**
   - Side-by-side comparison of current student competencies versus industry expectations across 10 curated tech roles.
   - Priority levels (*High*, *Medium*, *Low*) and estimated learning durations.
   - Interactive progress sliders and status toggles (*Not Started*, *In Progress*, *Completed*) that persist directly in the database.
   - Dynamically recalculates career readiness and automatically updates the student's profile.

3. **Structured 6-Phase Learning Roadmap**
   - Step-by-step master plan for each target career:
     - **Phase 1:** Fundamentals & Computer Science Core
     - **Phase 2:** Core Technical Specialization
     - **Phase 3:** Real-World Practical Projects
     - **Phase 4:** Portfolio, GitHub & Public Proof-of-Work
     - **Phase 5:** Resume Preparation & ATS Optimization
     - **Phase 6:** Interview Practice & Job Applications
   - Phase objectives, topics to study, practical tasks, milestone projects, and clickable links to official docs, freeCodeCamp, MDN Web Docs, CS50, and Harvard.
   - Interactive checklist with persistent completion tracking.

4. **Resume Upload & AI ATS Analyzer**
   - Drag-and-drop document upload supporting both `.pdf` and `.docx` files up to 5MB.
   - Safe in-memory document parsing using `pdf-parse` and `mammoth` (no execution of untrusted code).
   - Generates an automated ATS compatibility score (0-100%), executive summary, detected skills, keywords found vs missing, strengths, weaknesses, and actionable improvement recommendations.
   - Rewrites candidate bullet points into the Google XYZ impact format (*"Accomplished [X], as measured by [Y], by doing [Z]"*).
   - Target role comparison mode and secure analysis deletion options.

5. **Interactive Mock Interview Practice**
   - Role selection (Software Developer, AI/ML Engineer, Data Analyst, Web Developer, Cloud Engineer, etc.).
   - Multiple interview categories: *Technical*, *Behavioral (STAR Method)*, *HR & General Fit*, and *Role-Specific*.
   - Question-by-question flow (5 questions per session).
   - Typed answers + optional browser voice input (**Web Speech SpeechRecognition**).
   - Constructive AI feedback on each answer: score out of 10, strengths, improvement areas, and model answer structure.
   - Session summary and historical practice tracking.

6. **Real-World Job Search & Application Tracker**
   - Real-time technology jobs from the **Remotive Open Remote API** + curated verified fresher roles.
   - Search by role, skill, company, or keyword.
   - Filter by location, work mode (*Remote*, *Hybrid*, *Onsite*), experience level (*Freshers & Entry-Level*, *Internships*).
   - One-click job bookmarking and personal Application Tracker (*Bookmarked*, *Applied*, *Interviewing*, *Offered*, *Rejected*) with custom interview notes.
   - Direct external search links for **LinkedIn Jobs**, **Indeed**, and **Naukri** with honest labeling.

7. **Bilingual Support (English & தமிழ்)**
   - Centralized internationalization system with full UI and AI guidance available in both English and தமிழ்.
   - Seamless language switcher in the navbar with preference saved across sessions.

8. **Secure Authentication & Student Profile**
   - Sign up, login, forgot password, reset password, and logout flows.
   - Full student profile management: education level, degree, graduation year, skill tagging, interests, preferred role, location, and work mode.
   - Row Level Security (RLS) policies and private route protections.

9. **Secure Admin Dashboard**
   - Role-based access control protecting administrative endpoints.
   - Aggregate analytics: total registrations, active students, assessments taken, resumes analyzed, interviews completed, and jobs tracked.
   - CRUD management for curated career roles, skills, and learning resources.
   - System service health monitoring (Database, Gemini LLM, and Remotive Job API).

---

## 🛠 Technology Stack

### Frontend
- **React 18** with **Vite**
- **TypeScript**
- **Tailwind CSS** with a professional navy, blue, violet, and white color palette
- **Lucide Icons**
- Responsive layouts for desktop, tablet, and mobile devices
- Centralized i18n (`/src/i18n/en.ts` and `/src/i18n/ta.ts`)

### Backend
- **Node.js** & **Express.js** REST API
- **Document Parsing:** `pdf-parse` (PDF) & `mammoth` (DOCX)
- **Security:** `helmet`, `cors`, `express-rate-limit`, `bcryptjs`, `jsonwebtoken`, and `zod` schema validation
- **Data Layer:** Dual-mode architecture supporting both **Supabase PostgreSQL** with Row Level Security (RLS) and an embedded **Local Persistent Store** for immediate zero-config operation.

### AI Integration
- **Google Gemini AI** (`@google/generative-ai` with `GEMINI_API_KEY`)
- If an API key is not configured, the system gracefully and transparently falls back to an intelligent, structured rule-based advisory engine with honest labeling.

---

## 📁 Project Structure

```
ai-career-guidance/
├── .env.example                     # Environment template
├── README.md                        # Documentation & setup guide
├── package.json                     # Root scripts
├── start.bat                        # One-click Windows launch script
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql   # Supabase tables, indexes, constraints
│   ├── rls_policies.sql             # Row Level Security policies
│   └── seed.sql                     # 10 curated roles & 15+ learning resources
├── server/
│   ├── src/
│   │   ├── config/                  # DB, Supabase, and environment configs
│   │   ├── middleware/              # Auth, RateLimiter, Upload, Error handler
│   │   ├── services/                # Gemini AI, Matching, Document parser, Job API
│   │   ├── routes/                  # REST API endpoints (Auth, Assessment, Skills, etc.)
│   │   ├── data/                    # Curated career roles & interview questions
│   │   └── index.js                 # Express server & static client serving
│   └── tests/                       # Unit tests (Matching, Resume parsing, etc.)
└── client/
    ├── src/
    │   ├── api/                     # REST API client
    │   ├── context/                 # AuthContext & LanguageContext
    │   ├── i18n/                    # English & Tamil translations
    │   ├── components/              # Navbar, Footer, ScoreRing, EmptyState, etc.
    │   ├── pages/                   # Landing, Dashboard, Assessment, Roadmap, etc.
    │   ├── App.tsx                  # Main router & layout
    │   └── main.tsx
    └── dist/                        # Production frontend build
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js v18+** or use the bundled portable Node runtime located in the `tools/` directory.

### 2. Environment Setup
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```
*(Optional)* Add your `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/) for live generative AI responses. If omitted, the application runs automatically in intelligent rule-based fallback mode.

*(Optional)* Add your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from your Supabase dashboard. If omitted, the application persists data in the local persistent store.

### 3. Running the Application
Launch both the backend and frontend with a single command:
```bash
# From the root directory:
npm start
```
Or double-click `start.bat` on Windows.

Open your browser at:
- **Application URL:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 4. Running Backend Unit Tests
```bash
npm test
```
All unit tests validate the career matching algorithm, ATS resume parser, and mock interview evaluation.

---

## 👤 Demo Credentials
You can test the application using pre-configured test accounts or by registering a new account:

- **Student Demo:**
  - Email: `priya.sharma@example.edu`
  - Password: `Student@2026`
- **Admin Demo:**
  - Email: `admin@aicareer.com`
  - Password: `Admin@2026`
