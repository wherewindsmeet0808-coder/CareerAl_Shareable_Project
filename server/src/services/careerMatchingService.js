import { CURATED_ROLES, CURATED_RESOURCES } from '../data/curatedCareers.js';

/**
 * Transparent, configurable Career Matching Engine
 *
 * Scoring Weights:
 * - Technical Skills: 45%
 * - Soft Skills & Interests: 25%
 * - Degree / Education Alignment: 15%
 * - Experience Level Suitability: 15%
 */
export function calculateRoleMatch(profileData, role) {
  const userTechSkills = (profileData.technical_skills || profileData.skills || []).map((s) => s.toLowerCase().trim());
  const userSoftSkills = (profileData.soft_skills || []).map((s) => s.toLowerCase().trim());
  const userInterests = (profileData.interests || []).map((s) => s.toLowerCase().trim());
  const userDegree = (profileData.education || profileData.degree || '').toLowerCase();
  const userExp = (profileData.experience_level || 'Student / Fresher').toLowerCase();

  // 1. Technical Skills Matching (45%)
  const requiredTech = role.required_technical_skills;
  const matchingTech = [];
  const missingTech = [];

  requiredTech.forEach((reqSkill) => {
    const reqLower = reqSkill.toLowerCase();
    const hasSkill = userTechSkills.some(
      (uSkill) => uSkill === reqLower || reqLower.includes(uSkill) || uSkill.includes(reqLower)
    );
    if (hasSkill) {
      matchingTech.push(reqSkill);
    } else {
      missingTech.push(reqSkill);
    }
  });

  const techScoreRatio = requiredTech.length > 0 ? matchingTech.length / requiredTech.length : 0;
  const techScore = Math.round(techScoreRatio * 45);

  // 2. Soft Skills & Interests Matching (25%)
  const requiredSoft = role.required_soft_skills;
  const matchingSoft = [];
  const missingSoft = [];

  requiredSoft.forEach((reqSoft) => {
    const reqLower = reqSoft.toLowerCase();
    const hasSoft = [...userSoftSkills, ...userInterests].some(
      (uItem) => uItem === reqLower || reqLower.includes(uItem) || uItem.includes(reqLower)
    );
    if (hasSoft) {
      matchingSoft.push(reqSoft);
    } else {
      missingSoft.push(reqSoft);
    }
  });

  const softScoreRatio = requiredSoft.length > 0 ? matchingSoft.length / requiredSoft.length : 0;
  const softScore = Math.round(softScoreRatio * 25);

  // 3. Education / Degree Alignment (15%)
  let educationScore = 8; // Baseline for STEM/degree students
  const suitableDegrees = role.suitable_degrees.map((d) => d.toLowerCase());
  const hasExactDegree = suitableDegrees.some((d) => userDegree.includes(d) || d.includes(userDegree));
  if (hasExactDegree) {
    educationScore = 15;
  } else if (userDegree.includes('computer') || userDegree.includes('tech') || userDegree.includes('engineering') || userDegree.includes('bca')) {
    educationScore = 12;
  }

  // 4. Experience Level Suitability (15%)
  let experienceScore = 12;
  if (userExp.includes('student') || userExp.includes('fresher')) {
    // Roles with great starter demand
    experienceScore = role.market_demand.includes('High') ? 14 : 12;
  } else if (userExp.includes('1-2') || userExp.includes('junior')) {
    experienceScore = 15;
  }

  // Raw total score out of 100
  let totalScore = Math.min(98, Math.max(25, techScore + softScore + educationScore + experienceScore));

  // Determine suitability rationale
  let suitabilityReason = '';
  if (matchingTech.length >= 3) {
    suitabilityReason = `Strong match based on your existing proficiency in ${matchingTech.slice(0, 3).join(', ')} and your academic background in ${profileData.education || profileData.degree || 'Technology'}.`;
  } else if (matchingTech.length >= 1) {
    suitabilityReason = `Promising alignment with your foundational knowledge of ${matchingTech.join(', ')}. By completing targeted upskilling in ${missingTech.slice(0, 2).join(' and ')}, you will be well-prepared for entry-level openings.`;
  } else {
    suitabilityReason = `Emerging opportunity suitable for transitioning into ${role.category}. High industry hiring demand makes this a viable pathway with structured foundational learning.`;
  }

  // Find relevant learning resources for missing skills
  const suggestedResources = [];
  missingTech.slice(0, 4).forEach((skill) => {
    const resource = CURATED_RESOURCES.find(
      (r) => r.skill.toLowerCase() === skill.toLowerCase() || skill.toLowerCase().includes(r.skill.toLowerCase())
    );
    if (resource) {
      suggestedResources.push(resource);
    } else {
      suggestedResources.push({
        title: `${skill} Documentation & Practice Guide`,
        skill: skill,
        provider: 'Official Docs & Tutorials',
        url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' beginner tutorial documentation')}`,
        is_free: true,
        level: 'beginner'
      });
    }
  });

  // Construct legitimate job search links
  const targetLocation = profileData.preferred_location || 'India';
  const roleEncoded = encodeURIComponent(role.title);
  const locEncoded = encodeURIComponent(targetLocation);

  const jobSearchLinks = {
    linkedin: `https://www.linkedin.com/jobs/search/?keywords=${roleEncoded}&location=${locEncoded}&f_E=1%2C2`, // Entry & Associate
    indeed: `https://www.indeed.com/jobs?q=${roleEncoded}+entry+level&l=${locEncoded}`,
    naukri: `https://www.naukri.com/${role.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-jobs-in-${targetLocation.toLowerCase().replace(/[^a-z0-9]/g, '-')}?experience=0`
  };

  return {
    role_id: role.id,
    role_title: role.title,
    category: role.category,
    description: role.description,
    match_percentage: totalScore,
    score_breakdown: {
      technical_skills: { score: techScore, max: 45, matching: matchingTech.length, total: requiredTech.length },
      soft_skills_and_interests: { score: softScore, max: 25, matching: matchingSoft.length, total: requiredSoft.length },
      education_alignment: { score: educationScore, max: 15 },
      experience_suitability: { score: experienceScore, max: 15 },
      methodology_notice: 'Match score is a transparent multi-factor heuristic estimate calculated from your submitted skills, education, and interests to guide your learning focus. It is not an employer hiring guarantee.'
    },
    matching_skills: matchingTech,
    missing_skills: missingTech,
    matching_soft_skills: matchingSoft,
    missing_soft_skills: missingSoft,
    suitability_reason: suitabilityReason,
    suggested_resources: suggestedResources,
    beginner_projects: role.beginner_projects,
    job_search_links: jobSearchLinks,
    market_demand: role.market_demand,
    avg_salary_range: role.avg_salary_range
  };
}

/**
 * Generate full ranked career recommendations for a student profile
 */
export function generateRecommendations(profileData, customRoles = null) {
  const rolesToEvaluate = customRoles || CURATED_ROLES;

  const evaluated = rolesToEvaluate.map((role) => calculateRoleMatch(profileData, role));

  // Sort descending by match percentage
  evaluated.sort((a, b) => b.match_percentage - a.match_percentage);

  return evaluated;
}
