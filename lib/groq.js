import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const buildKitPrompt = (details) => {
  const { 
    idea, 
    projectType, 
    techStack, 
    scalability, 
    deployment, 
    features, 
    budget, 
    timeline, 
    integrations 
  } = details;

  const systemPrompt = `You are a world-class brand and project strategist. 
  You MUST respond with valid JSON only. No text outside JSON.
  Include ALL these keys: brandNames, tagline, userPersonas, logoPrompts, socialBios, colors, fonts, landingCopy, pricingCopy, twitterThread, productHunt, marketingStrategy, seoKeywords, growthHacks, brandVoice.`;

  const userPrompt = `
  Startup Idea: ${idea}
  Project Type: ${projectType || 'General'}
  Tech Stack: ${techStack || 'Modern web stack'}
  Scalability: ${scalability || 'MVP'}
  Deployment: ${deployment || 'Vercel/Cloud'}
  Features: ${features || 'Standard features'}
  Budget: ${budget || 'Lean startup'}
  Timeline: ${timeline || '60 seconds'}
  Integrations: ${integrations || 'Standard APIs'}
  
  Create a comprehensive brand and starter kit JSON. The content should be tailored to the specific tech stack, budget, and timeline provided.
  
  Structure:
  {
    "brandNames": [{"name": "Name", "reason": "Why it fits the tech/market"}],
    "tagline": "Punchy tagline",
    "userPersonas": [{"name": "User", "description": "Who", "painPoint": "Problem"}],
    "logoPrompts": ["Minimal prompt", "Artistic prompt"],
    "socialBios": {"instagram": "Bio", "tiktok": "Bio", "twitter": "Bio"},
    "colors": [{"hex": "#hex", "name": "Name", "role": "primary"}],
    "fonts": {"heading": "Font", "body": "Font", "pairing_reason": "Reason"},
    "landingCopy": {"hero": "Headline", "subtext": "Subtext", "cta": "CTA"},
    "pricingCopy": {"tier1": "Free", "tier2": "Pro", "tier3": "Enterprise"},
    "twitterThread": ["Tweet 1", "Tweet 2"],
    "productHunt": {"tagline": "PH Tagline", "description": "PH Desc"},
    "marketingStrategy": ["Strategy 1", "Strategy 2", "Strategy 3"],
    "seoKeywords": ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4", "Keyword 5"],
    "growthHacks": ["Hack 1", "Hack 2"],
    "brandVoice": {"tone": "Tone description", "style": "Writing style", "example": "A sentence in this voice"}
  }`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];
};

export const buildRefreshBlockPrompt = (blockKey, currentKit) => {
  const systemPrompt = "You are a world-class brand strategist and copywriter. You are helping to refine a specific part of a brand kit while maintaining consistency with the rest of the brand's identity. Respond with valid JSON only — no markdown, no backticks, no explanation.";

  const blockStructures = {
    brandNames: `{ "brandNames": [{ "name": "string", "reason": "one sentence why" }, { "name": "string", "reason": "one sentence why" }, { "name": "string", "reason": "one sentence why" }] }`,
    tagline: `{ "tagline": "string (max 8 words, punchy)" }`,
    colors: `{ "colors": [{ "hex": "#XXXXXX", "name": "string", "role": "primary" }, { "hex": "#XXXXXX", "name": "string", "role": "background" }, { "hex": "#XXXXXX", "name": "string", "role": "surface" }, { "hex": "#XXXXXX", "name": "string", "role": "text" }, { "hex": "#XXXXXX", "name": "string", "role": "accent" }] }`,
    fonts: `{ "fonts": { "heading": "font name", "body": "font name", "pairing_reason": "one sentence" } }`,
    landingCopy: `{ "landingCopy": { "hero": "string", "subtext": "string", "cta": "string" } }`,
    pricingCopy: `{ "pricingCopy": { "tier1": "string", "tier2": "string", "tier3": "string" } }`,
    twitterThread: `{ "twitterThread": ["Tweet 1", "Tweet 2", "Tweet 3", "Tweet 4", "Tweet 5"] }`,
    productHunt: `{ "productHunt": { "tagline": "string", "description": "string" } }`,
    marketingStrategy: `{ "marketingStrategy": ["Strategy 1", "Strategy 2", "Strategy 3"] }`,
    seoKeywords: `{ "seoKeywords": ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4", "Keyword 5"] }`,
    growthHacks: `{ "growthHacks": ["Hack 1", "Hack 2"] }`,
    brandVoice: `{ "brandVoice": { "tone": "string", "style": "string", "example": "string" } }`,
    userPersonas: `{ "userPersonas": [{ "name": "string", "description": "string", "painPoint": "string" }, { "name": "string", "description": "string", "painPoint": "string" }] }`,
    logoPrompts: `{ "logoPrompts": ["string", "string"] }`,
    socialBios: `{ "socialBios": { "instagram": "string", "tiktok": "string", "twitter": "string" } }`
  };

  const userPrompt = `Refresh the "${blockKey}" section for this startup idea: ${currentKit.ideaPrompt}.
  
Existing Brand Context to stay aligned with:
- Brand Names: ${currentKit.brandNames.map(b => b.name).join(', ')}
- Tagline: ${currentKit.tagline}
- Core Vibe: ${currentKit.fonts.pairing_reason}

Current data for this section: ${JSON.stringify(currentKit[blockKey])}

Respond with ONLY a JSON object in this exact structure:
${blockStructures[blockKey]}

The new content must be different from the current data but perfectly aligned with the overall brand identity.`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];
};

export default groq;
