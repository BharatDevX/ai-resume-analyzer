const SKILLS = [
  "javascript", "react", "next.js", "Node.js",
  "mongodb", "sql", "python", "java",
  "c++", "machine learning", "ai",
  "docker", "aws", "git"
];

export function extractSkills(text){
    return SKILLS.filter(skill => text.includes(skill));
}