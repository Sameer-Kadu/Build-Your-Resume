/**
 * ATS Optimization Utilities
 * Helps in scoring and improving resume content for Applicant Tracking Systems.
 */

export const ACTION_VERBS = [
  'Developed', 'Optimized', 'Implemented', 'Designed', 'Led', 'Managed', 
  'Increased', 'Reduced', 'Spearheaded', 'Engineered', 'Architected',
  'Collaborated', 'Delivered', 'Automated', 'Enhanced', 'Launched'
];

export interface ATSCheckResult {
  score: number;
  suggestions: string[];
}

/**
 * Calculates a simulated ATS score based on resume content
 */
export const calculateATSScore = (resumeData: any): ATSCheckResult => {
  let score = 0;
  const suggestions: string[] = [];

  // 1. Personal Info Check
  if (resumeData.personalInfo.fullName) score += 10;
  else suggestions.push('Add your full name.');
  
  if (resumeData.personalInfo.email && resumeData.personalInfo.phone) score += 10;
  else suggestions.push('Ensure both email and phone number are present.');

  // 2. Summary Check
  if (resumeData.summary && resumeData.summary.length > 100) {
    score += 10;
  } else {
    suggestions.push('Add a professional summary (at least 100 characters).');
  }

  // 3. Experience Check
  if (resumeData.experience.length > 0) {
    score += 20;
    
    // Check for bullet points and action verbs
    let actionVerbCount = 0;
    let totalBullets = 0;
    
    resumeData.experience.forEach((exp: any) => {
      totalBullets += exp.description.length;
      exp.description.forEach((bullet: string) => {
        if (ACTION_VERBS.some(verb => bullet.toLowerCase().startsWith(verb.toLowerCase()))) {
          actionVerbCount++;
        }
      });
    });

    if (totalBullets >= 3) score += 10;
    else suggestions.push('Add more bullet points to your experience (at least 3 total).');

    if (actionVerbCount >= 2) score += 10;
    else suggestions.push('Start your bullet points with strong action verbs (e.g., Developed, Managed).');
  } else {
    suggestions.push('Add at least one professional experience.');
  }

  // 4. Skills Check
  if (resumeData.skills.length >= 5) {
    score += 15;
  } else {
    suggestions.push('Add at least 5 relevant skills.');
  }

  // 5. Education Check
  if (resumeData.education.length > 0) {
    score += 15;
  } else {
    suggestions.push('Add your education history.');
  }

  return {
    score: Math.min(score, 100),
    suggestions
  };
};

/**
 * Suggests improvements for a bullet point using the STAR method
 */
export const suggestSTARImprovement = (bullet: string): string => {
  if (!bullet) return '';
  
  // Simple heuristic check
  const hasNumber = /\d+/.test(bullet);
  const startsWithActionVerb = ACTION_VERBS.some(verb => bullet.toLowerCase().startsWith(verb.toLowerCase()));
  
  if (!startsWithActionVerb) {
    return `Try starting with an action verb like "${ACTION_VERBS[0]}" or "${ACTION_VERBS[1]}".`;
  }
  
  if (!hasNumber) {
    return 'Try to quantify your impact with numbers or percentages (e.g., "Increased revenue by 20%").';
  }
  
  return 'Looks good! Ensure it follows the STAR (Situation, Task, Action, Result) method.';
};
