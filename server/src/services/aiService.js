import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../config/env.js';
import { MOCK_INTERVIEW_QUESTIONS_BANK, CURATED_ROLES } from '../data/curatedCareers.js';

let genAI = null;
let geminiModel = null;

if (ENV.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
    // Use gemini-1.5-flash or gemini-2.0-flash for fast and reliable responses
    geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✓ Google Gemini AI Service successfully initialized');
  } catch (err) {
    console.warn('⚠ Could not initialize Google Gemini client:', err.message);
  }
} else {
  console.log('ℹ GEMINI_API_KEY not detected. System will operate in Intelligent Rule-Based Fallback Mode with honest attribution.');
}

export const isAIConfigured = () => Boolean(geminiModel);

/**
 * Sanitizes input to protect against prompt injection and confidentiality leaks
 */
function sanitizeInput(text, maxLength = 8000) {
  if (!text || typeof text !== 'string') return '';
  return text
    .slice(0, maxLength)
    .replace(/ignore previous instructions/gi, '[filtered]')
    .replace(/system prompt/gi, '[filtered]')
    .replace(/reveal secret/gi, '[filtered]');
}

export const aiService = {
  getStatus() {
    return {
      provider: isAIConfigured() ? 'Google Gemini AI (gemini-1.5-flash)' : 'Intelligent Rule-Based Advisory Engine (Fallback)',
      isRealAI: isAIConfigured(),
      notice: isAIConfigured()
        ? 'Live LLM API is active.'
        : 'AI API key is currently unconfigured in the backend environment. Intelligent structured rule-based fallback is active. Set GEMINI_API_KEY in server .env to activate live generative AI.'
    };
  },

  /**
   * 1. CHAT WITH CAREER COACH (English & Tamil supported)
   */
  async chatWithCareerCoach({ messages, studentProfile, language = 'en' }) {
    const isTamil = language === 'ta';
    const profileContext = studentProfile
      ? `Student Profile Information:
- Name: ${studentProfile.full_name || 'Student'}
- Education: ${studentProfile.degree || studentProfile.education_level || 'Undergraduate'}
- Current Skills: ${(studentProfile.skills || []).join(', ') || 'Not specified'}
- Interests: ${(studentProfile.interests || []).join(', ') || 'Technology'}
- Target Role: ${studentProfile.preferred_role || 'Software Engineering'}
- Experience: ${studentProfile.experience_level || 'Fresher'}`
      : 'No student profile context supplied.';

    const systemPrompt = `You are a warm, highly encouraging, and realistic AI Career Guidance Mentor dedicated to helping college students, freshers, and job seekers in India and globally.
${profileContext}

Guardrails:
1. Always be honest about industry expectations and salary estimates. Do NOT promise guaranteed jobs or invent company openings.
2. If language is Tamil ('ta'), respond in natural, polite Tamil (தமிழ்) with standard English technical terms transliterated or kept in parentheses where appropriate for clarity.
3. Answer questions about career options, skill development roadmaps, programming concepts, interview prep, and resume improvement.
4. Keep responses structured, concise, and actionable using bullet points and bold highlights.
5. If you do not know something, honestly acknowledge it rather than speculating.`;

    if (isAIConfigured()) {
      try {
        const lastUserMessage = messages[messages.length - 1]?.content || 'Hello';
        const formattedHistory = messages.slice(0, -1).map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: sanitizeInput(m.content) }]
        }));

        const chat = geminiModel.startChat({
          history: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: isTamil ? 'வணக்கம்! நான் உங்கள் ஏஐ தொழில் வழிகாட்டி. நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?' : 'Hello! I am your AI Career Guidance Mentor. How can I assist you with your career goals today?' }] },
            ...formattedHistory
          ]
        });

        const result = await chat.sendMessage(sanitizeInput(lastUserMessage));
        const reply = result.response.text();
        return {
          content: reply,
          source: 'Google Gemini AI',
          isLiveAI: true
        };
      } catch (err) {
        console.warn('Gemini chat error, falling back:', err.message);
      }
    }

    // Rule-Based Fallback
    const lastMsg = (messages[messages.length - 1]?.content || '').toLowerCase();
    let replyText = '';

    if (isTamil) {
      if (lastMsg.includes('resume') || lastMsg.includes('ரெஸ்யூம்')) {
        replyText = `**ரெஸ்யூம் மேம்படுத்துவதற்கான முக்கிய குறிப்புகள் (Resume Tips):**\n\n1. **ஒரு பக்க வடிவம் (Single Page):** ஃப்ரெஷர்களுக்கு ஒரு பக்க ரெஸ்யூம் போதுமானது.\n2. **திட்டப்பணிகள் (Projects):** உங்கள் கல்லூரி மற்றும் சுய திட்டங்களை GitHub லிங்குடன் சேர்க்கவும்.\n3. **செயல்பாட்டு வினைச்சொற்கள் (Action Verbs):** Built, Engineered, Optimized போன்ற வார்த்தைகளைப் பயன்படுத்தவும்.\n4. **ATS முக்கிய வார்த்தைகள்:** நீங்கள் விண்ணப்பிக்கும் வேலைக்குரிய தொழில்நுட்ப திறன்களை (Skills) சேர்க்கவும்.`;
      } else if (lastMsg.includes('interview') || lastMsg.includes('நேர்காணல்')) {
        replyText = `**நேர்காணல் தயார் செய்யும் உத்திகள் (Interview Preparation):**\n\n1. **STAR முறை:** Behavioral கேள்விகளுக்கு Situation, Task, Action, Result முறையில் பதிலளிக்கவும்.\n2. **அடிப்படை கோட்பாடுகள்:** Data Structures, OOPs மற்றும் DBMS கருத்துகளை தெளிவாகக் கற்றுக்கொள்ளுங்கள்.\n3. **எங்கள் Mock Interview வசதி:** இடதுபுற மெனுவில் உள்ள 'Mock Interview' பகுதியை பயன்படுத்தி இப்போதே பயிற்சி செய்யுங்கள்!`;
      } else {
        replyText = `வணக்கம் ${studentProfile?.full_name || 'மாணவரே'}! உங்கள் தொழில் தேர்வு மற்றும் திறன் மேம்பாட்டிற்கு நான் உதவ தயாராக உள்ளேன்.\n\n- **பரிந்துரைக்கப்பட்ட வேலைகள்:** உங்கள் திறன்களுக்கேற்ப மென்பொருள் பொறியாளர், தரவு ஆய்வாளர் போன்ற வாய்ப்புகள் உள்ளன.\n- **அடுத்த படி:** எங்கள் 'Career Assessment' அல்லது 'Skill Gap' பக்கங்களை பார்வையிடுங்கள்!\n\n*(குறிப்பு: நேரடி LLM பதில்களுக்கு சேவையகத்தில் GEMINI_API_KEY சேர்க்கப்பட வேண்டும்).*`;
      }
    } else {
      if (lastMsg.includes('resume') || lastMsg.includes('cv')) {
        replyText = `**Top Resume Improvement Recommendations for Freshers:**\n\n- **Length:** Limit to a clean 1-page layout formatted with clear sections.\n- **Highlight Impact:** Use the format *"Accomplished [X], as measured by [Y], by doing [Z]"*.\n- **Project Links:** Include working live demo links and clean GitHub repositories for your top 2-3 projects.\n- **ATS Keywords:** Mirror key technologies explicitly (e.g. React, Node.js, SQL, Git).\n\nUse our **Resume Analyzer** tab to get an instant automated ATS score and line-by-line feedback!`;
      } else if (lastMsg.includes('interview')) {
        replyText = `**Mock Interview Preparation Strategy:**\n\n1. **Master the Fundamentals:** Deeply understand time complexities, OOP design principles, and REST API conventions.\n2. **The STAR Framework:** Structure behavioral answers around **S**ituation, **T**ask, **A**ction, and **R**esult.\n3. **Practice Out Loud:** Use our **Mock Interview** module with speech-to-text to test your answers against real technical criteria!`;
      } else {
        replyText = `Hello ${studentProfile?.full_name || 'there'}! I am here to guide your career exploration.\n\n- **Target Role Guidance:** Focus on mastering 1-2 core technical stacks (e.g., MERN, Python/Data) rather than spreading yourself too thin.\n- **Next Step:** Complete our comprehensive **Career Assessment** to generate a personalized match score and 6-phase learning roadmap.\n\n*(Notice: Running in Rule-Based Mode. Configure GEMINI_API_KEY in server .env for open-ended generative AI conversations).*`;
      }
    }

    return {
      content: replyText,
      source: 'Intelligent Rule-Based Advisory Engine (Fallback)',
      isLiveAI: false
    };
  },

  /**
   * 2. RESUME ANALYSIS & ATS EVALUATION
   */
  async analyzeResume({ resumeText, targetRole = 'Software Developer', language = 'en' }) {
    const sanitizedResume = sanitizeInput(resumeText, 12000);

    if (isAIConfigured()) {
      try {
        const prompt = `You are a principal tech recruiter and ATS (Applicant Tracking System) specialist.
Analyze this candidate resume for the target role: "${targetRole}".

Resume Content:
${sanitizedResume}

Return a STRICT JSON object with the following exact keys:
{
  "ats_score": number between 40 and 95,
  "summary": "Concise 2-3 sentence executive evaluation",
  "detected_skills": ["array of skills extracted from resume"],
  "education_experience_summary": "Summary of candidate education & practical background",
  "project_highlights": ["Array of top 2-3 project strengths noted"],
  "keywords_found": ["Key technical keywords present"],
  "keywords_missing": ["Critical high-value keywords for ${targetRole} that are missing"],
  "strengths": ["3 key candidate strengths"],
  "weaknesses": ["3 areas lacking evidence or detail"],
  "actionable_improvements": ["4 specific bullet points candidate can implement immediately"],
  "ats_feedback": {
    "formatting": "Feedback on section clarity and readability",
    "keyword_density": "Assessment of industry terms",
    "impact_phrasing": "Assessment of action verbs and quantifiable results"
  },
  "suggested_roles": ["Top 3 matching job roles based on skills"],
  "improved_outline": {
    "suggested_headline": "Compelling candidate headline",
    "sample_bullet_rewrites": [
      { "original": "Worked on website", "improved": "Architected responsive web portal with React and Node.js, cutting page load time by 35%" }
    ]
  }
}
Do not include markdown fences outside the JSON. Return valid JSON only.`;

        const result = await geminiModel.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return { ...parsed, isLiveAI: true, source: 'Google Gemini AI ATS Analyzer' };
        }
      } catch (err) {
        console.warn('Gemini resume analysis failed, falling back:', err.message);
      }
    }

    // Comprehensive Rule-Based ATS Parser Fallback
    const lowerText = sanitizedResume.toLowerCase();
    const commonTechSkills = [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'react', 'node.js', 'express', 'sql',
      'mongodb', 'postgresql', 'mysql', 'git', 'html', 'css', 'tailwind', 'docker', 'aws', 'linux',
      'rest api', 'graphql', 'figma', 'machine learning', 'data analysis', 'pandas', 'numpy', 'scikit-learn'
    ];

    const detectedSkills = commonTechSkills.filter((skill) => lowerText.includes(skill)).map((s) => s.toUpperCase());
    const roleTarget = CURATED_ROLES.find((r) => r.title.toLowerCase() === targetRole.toLowerCase()) || CURATED_ROLES[0];
    const missingSkills = roleTarget.required_technical_skills.filter(
      (req) => !lowerText.includes(req.toLowerCase())
    );

    // Calculate heuristic ATS Score
    let score = 55;
    if (detectedSkills.length >= 6) score += 20;
    else if (detectedSkills.length >= 3) score += 10;
    if (lowerText.includes('project') || lowerText.includes('github')) score += 10;
    if (lowerText.includes('education') || lowerText.includes('bachelor') || lowerText.includes('degree')) score += 5;
    if (lowerText.includes('built') || lowerText.includes('developed') || lowerText.includes('designed')) score += 5;
    score = Math.min(92, Math.max(45, score));

    return {
      ats_score: score,
      summary: `Resume demonstrates a promising foundational profile for ${targetRole} with ${detectedSkills.length} identified technical competencies. Enhancing quantifiable project achievements and incorporating missing core role keywords will significantly strengthen ATS pass rates.`,
      detected_skills: detectedSkills.length > 0 ? detectedSkills : ['General Programming', 'Problem Solving', 'Computer Science Foundations'],
      education_experience_summary: lowerText.includes('degree') || lowerText.includes('b.tech') || lowerText.includes('engineering')
        ? 'Technical undergraduate background with academic coursework and hands-on laboratory experience.'
        : 'Self-directed learner or candidate with project-based experience in software applications.',
      project_highlights: [
        'Demonstrates capability in application development and foundational coding',
        'Includes evidence of personal or academic project implementations'
      ],
      keywords_found: detectedSkills.slice(0, 8),
      keywords_missing: missingSkills.slice(0, 5),
      strengths: [
        'Clear educational trajectory and core technical awareness',
        'Demonstrated interest in modern software tools',
        'Clean section progression suitable for entry-level screening'
      ],
      weaknesses: [
        'Quantifiable business or engineering metrics (e.g. % performance increase, active users) are minimal',
        'Missing explicit mention of testing, CI/CD, or deployment experience',
        'Bullet points describe responsibilities rather than verified outcomes'
      ],
      actionable_improvements: [
        `Explicitly incorporate high-priority missing keywords: ${missingSkills.slice(0, 3).join(', ')}.`,
        'Add active GitHub repository and live deployment URLs for each portfolio project.',
        'Adopt the Google XYZ format: "Accomplished [X], as measured by [Y], by doing [Z]".',
        'Ensure contact information includes a verified LinkedIn profile and clean professional email.'
      ],
      ats_feedback: {
        formatting: 'Recommended standard single-column ATS layout with clear standard headers (Education, Skills, Projects, Experience).',
        keyword_density: `Identified ${detectedSkills.length} relevant technical terms. Target role calls for greater density in ${missingSkills.slice(0, 3).join(', ')}.`,
        impact_phrasing: 'Action verbs detected. Upgrade passive descriptions like "responsible for" to assertive verbs such as "engineered", "streamlined", and "deployed".'
      },
      suggested_roles: [targetRole, 'Junior Software Engineer', 'Full Stack Intern'],
      improved_outline: {
        suggested_headline: `${targetRole} | Aspiring Engineer specializing in ${detectedSkills.slice(0, 3).join(', ') || 'Modern Tech'}`,
        sample_bullet_rewrites: [
          {
            original: 'Worked on web application for college project',
            improved: 'Engineered full-stack responsive web application using modern components, handling 50+ concurrent requests with 99.8% uptime.'
          },
          {
            original: 'Responsible for database management',
            improved: 'Designed normalized relational schema in PostgreSQL, reducing query latency by 25% through indexed foreign keys.'
          }
        ]
      },
      isLiveAI: false,
      source: 'Comprehensive Rule-Based ATS Parser (Fallback)'
    };
  },

  /**
   * 3. GENERATE MOCK INTERVIEW QUESTIONS
   */
  async generateInterviewQuestions({ role = 'Software Developer', category = 'technical', experienceLevel = 'Student / Fresher' }) {
    if (isAIConfigured()) {
      try {
        const prompt = `Generate exactly 5 realistic, high-quality interview questions for a ${experienceLevel} candidate interviewing for a "${role}" role in the "${category}" category.
Return a STRICT JSON array of objects with keys:
- "id": number (1 to 5)
- "text": "The exact interview question"
- "criteria": "Key points candidate should cover in their answer"

Return valid JSON array only.`;

        const result = await geminiModel.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const questions = JSON.parse(jsonMatch[0]);
          return { questions, isLiveAI: true };
        }
      } catch (err) {
        console.warn('Gemini interview questions generation failed:', err.message);
      }
    }

    // Curated bank fallback
    const roleBank = MOCK_INTERVIEW_QUESTIONS_BANK[role] || MOCK_INTERVIEW_QUESTIONS_BANK['Software Developer'];
    const categoryQuestions = roleBank[category] || roleBank.technical || [];

    // Ensure 5 questions
    const fallbackList = [
      { id: 1, text: `What motivated you to pursue a career as a ${role}, and what core project best demonstrates your readiness?`, criteria: 'Career passion, learning initiative, and concrete project example.' },
      { id: 2, text: `Walk me through your problem-solving process when tackling an unfamiliar technical bug or requirement.`, criteria: 'Systematic debugging, documentation reference, isolation of variables, testing.' },
      { id: 3, text: `How do you ensure code quality, readability, and maintainability in your personal or team projects?`, criteria: 'Modular design, version control commits, unit testing, clean naming conventions.' },
      { id: 4, text: `Describe a time when you received constructive feedback on your code or work. How did you handle it?`, criteria: 'Openness to growth, emotional maturity, iterative improvement.' },
      { id: 5, text: `Where do you see technology in this field heading in the next 2-3 years, and what skills are you proactively learning?`, criteria: 'Industry awareness, curiosity, continuous learning habit.' }
    ];

    const questions = categoryQuestions.length >= 3 ? [...categoryQuestions, ...fallbackList].slice(0, 5) : fallbackList;
    return {
      questions: questions.map((q, idx) => ({ ...q, id: idx + 1 })),
      isLiveAI: false
    };
  },

  /**
   * 4. EVALUATE MOCK INTERVIEW ANSWER
   */
  async evaluateInterviewAnswer({ question, answer, role = 'Software Developer', language = 'en' }) {
    const isTamil = language === 'ta';
    const cleanAnswer = sanitizeInput(answer, 4000);

    if (isAIConfigured()) {
      try {
        const prompt = `You are a senior hiring manager conducting an interview for a "${role}" position.
Question: "${question}"
Candidate Answer: "${cleanAnswer}"

Evaluate this answer constructively based on relevance, technical correctness, clarity, and depth.
${isTamil ? 'Respond with feedback in Tamil (தமிழ்).' : 'Respond in English.'}

Return a STRICT JSON object:
{
  "score": number between 1.0 and 10.0 (one decimal place),
  "strengths": "1-2 sentences on what the candidate did well",
  "improvements": "1-2 actionable recommendations to make the answer more impactful",
  "model_answer": "A concise, exemplar model answer showing how a top candidate would structure this response using STAR or architectural breakdown."
}
Return valid JSON only.`;

        const result = await geminiModel.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return { ...parsed, isLiveAI: true, source: 'Google Gemini AI Evaluator' };
        }
      } catch (err) {
        console.warn('Gemini interview evaluation failed:', err.message);
      }
    }

    // Rule-Based Evaluation Fallback
    const wordCount = cleanAnswer.trim().split(/\s+/).length;
    let score = 5.0;

    if (wordCount < 15) {
      score = 3.5;
    } else if (wordCount < 40) {
      score = 6.0;
    } else if (wordCount < 90) {
      score = 7.5;
    } else {
      score = 8.5;
    }

    if (cleanAnswer.toLowerCase().includes('example') || cleanAnswer.toLowerCase().includes('project')) {
      score = Math.min(9.5, score + 0.8);
    }

    score = Number(score.toFixed(1));

    if (isTamil) {
      return {
        score,
        strengths: 'உங்கள் பதிலில் குறிப்பிட்ட கருத்துகள் மற்றும் தெளிவான நோக்கம் வெளிப்படுகிறது.',
        improvements: 'உதாரணங்கள் (Examples) மற்றும் அளவிடக்கூடிய முடிவுகளை (Metrics) சேர்த்தால் பதில் இன்னும் சிறப்பாக இருக்கும்.',
        model_answer: 'முதலில் முக்கிய கருத்தை சுருக்கமாக கூறி, பின் நீங்கள் செய்த திட்டத்தின் மூலம் அதை நிரூபிக்கும் வகையில் STAR முறையில் பதிலளிக்கவும்.',
        isLiveAI: false,
        source: 'Rule-Based Evaluation Engine (Fallback)'
      };
    }

    return {
      score,
      strengths: wordCount > 30
        ? 'Good conceptual coverage and clear articulation of the primary subject matter.'
        : 'Concise attempt that directly addresses the core question premise.',
      improvements: wordCount < 40
        ? 'Elaborate further by incorporating a concrete project example using the STAR method (Situation, Task, Action, Result).'
        : 'Highlight quantifiable engineering outcomes or edge-case handling to demonstrate senior-level depth.',
      model_answer: `A top response begins with a crisp 1-sentence definition, transitions into real-world trade-offs (e.g. scalability, complexity, maintainability), and concludes with a 30-second walkthrough of a project where you implemented this directly.`,
      isLiveAI: false,
      source: 'Rule-Based Evaluation Engine (Fallback)'
    };
  }
};
