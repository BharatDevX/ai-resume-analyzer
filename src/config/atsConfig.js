// config/atsConfig.js
export const ATS_CONFIG = {
  weights: {
    skill: 0.5,
    semantic: 0.3,
    experience: 0.2
  },
  thresholds: {
    strong: 75,
    potential: 55
  },
  penalties: {
    missingCriticalSkill: -5
  }
};
