/**
 * Job Title Categorization Utility
 * Automatically assigns a category and sub-category based on a job title input.
 */

const mappingData = {
  "mappings": [
    {
      "keywords": ["web", "fullstack", "site", "internet", "en ligne"],
      "category": "Développement Informatique",
      "sub_category": "Développeur Fullstack"
    },
    {
      "keywords": ["front", "frontend", "interface", "react", "vue", "angular", "ui dev"],
      "category": "Développement Informatique",
      "sub_category": "Développeur Frontend"
    },
    {
      "keywords": ["back", "backend", "api", "node", "laravel", "php", "python", "java", "golang"],
      "category": "Développement Informatique",
      "sub_category": "Développeur Backend"
    },
    {
      "keywords": ["mobile", "ios", "android", "flutter", "swift", "kotlin", "native"],
      "category": "Développement Informatique",
      "sub_category": "Développeur Mobile"
    },
    {
      "keywords": ["devops", "cloud", "aws", "docker", "kubernetes", "infra", "sre"],
      "category": "Développement Informatique",
      "sub_category": "DevOps"
    },
    {
      "keywords": ["data", "science", "ai", "ml", "machine learning", "intelligence artificielle"],
      "category": "Développement Informatique",
      "sub_category": "Data Scientist"
    },
    {
      "keywords": ["database", "sql", "dba", "base de données", "mysql", "mongodb"],
      "category": "Développement Informatique",
      "sub_category": "Administrateur Base de données"
    },
    {
      "keywords": ["design", "ui", "ux", "maquette", "ergonomie", "utilisateur"],
      "category": "Design & Création",
      "sub_category": "Designer UI/UX"
    },
    {
      "keywords": ["graphiste", "logo", "visuel", "pao", "photoshop", "illustrator"],
      "category": "Design & Création",
      "sub_category": "Graphiste"
    },
    {
      "keywords": ["marketing", "pub", "digital", "croissance", "growth"],
      "category": "Marketing & Communication",
      "sub_category": "Responsable Marketing Digital"
    },
    {
      "keywords": ["community", "social", "réseaux", "facebook", "instagram"],
      "category": "Marketing & Communication",
      "sub_category": "Community Manager"
    },
    {
      "keywords": ["commercial", "vente", "vendeur", "prospection", "terrain"],
      "category": "Commercial & Vente",
      "sub_category": "Commercial"
    },
    {
      "keywords": ["rh", "recrutement", "ressources humaines", "talent"],
      "category": "Ressources Humaines",
      "sub_category": "Recruteur"
    },
    {
      "keywords": ["comptable", "compta", "bilan", "fiscal", "facture"],
      "category": "Finance & Comptabilité",
      "sub_category": "Comptable"
    },
    {
      "keywords": ["chef de projet", "project manager", "pm", "pmo", "pilotage"],
      "category": "Management & Direction",
      "sub_category": "Chef de Projet"
    }
  ]
};

/**
 * Normalizes text for better matching.
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9 ]/g, " ")     // Remove special characters
    .trim();
}

/**
 * Categorizes a job title based on keywords.
 * @param {string} title - User input
 * @returns {Object|null} Best match or null
 */
function categorizeJobTitle(title) {
  if (!title) return null;
  
  const normalizedTitle = normalizeText(title);
  const words = normalizedTitle.split(/\s+/);
  
  let bestMatch = null;
  let maxScore = 0;
  
  for (const mapping of mappingData.mappings) {
    let score = 0;
    
    for (const keyword of mapping.keywords) {
      const normalizedKeyword = normalizeText(keyword);
      
      // Check if keyword is in the title
      if (normalizedTitle.includes(normalizedKeyword)) {
        // Boost score if keyword is a whole word or phrase
        score += normalizedKeyword.split(/\s+/).length * 10;
      }
    }
    
    if (score > maxScore) {
      maxScore = score;
      bestMatch = {
        category: mapping.category,
        sub_category: mapping.sub_category,
        score: score
      };
    }
  }
  
  // Requirement: Handle ambiguity or variants
  return maxScore > 0 ? bestMatch : null;
}

// Example usage and tests
const testCases = [
  "Développeur Web",
  "Dev web",
  "Ingénieur développement web",
  "Designer UX",
  "Responsable Marketing Digital",
  "Commercial junior",
  "RH Manager"
];

console.log("Results for job title categorization:");
testCases.forEach(test => {
  const result = categorizeJobTitle(test);
  console.log(`- Input: "${test}" => ${result ? `${result.category} / ${result.sub_category} (Score: ${result.score})` : "No match found"}`);
});
