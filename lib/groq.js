import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const buildKitPrompt = (idea) => {
  const systemPrompt = "You are a world-class brand strategist and copywriter. You create startup brand kits that are distinctive, memorable, and tailored precisely to the idea described. You always respond with valid JSON only — no markdown, no backticks, no explanation. Every output must feel custom-crafted for the specific idea, not generic.";

  const userPrompt = `Create a complete brand kit for this startup idea: ${idea}

Respond with ONLY a JSON object in this exact structure:
{
  "brandNames": [
    { "name": "string", "reason": "one sentence why this name fits" },
    { "name": "string", "reason": "one sentence why this name fits" },
    { "name": "string", "reason": "one sentence why this name fits" }
  ],
  "tagline": "string (max 8 words, punchy)",
  "colors": [
    { "hex": "#XXXXXX", "name": "string", "role": "primary" },
    { "hex": "#XXXXXX", "name": "string", "role": "background" },
    { "hex": "#XXXXXX", "name": "string", "role": "surface" },
    { "hex": "#XXXXXX", "name": "string", "role": "text" },
    { "hex": "#XXXXXX", "name": "string", "role": "accent" }
  ],
  "fonts": {
    "heading": "font name",
    "body": "font name",
    "pairing_reason": "one sentence why this pairing fits the brand"
  },
  "landingCopy": {
    "hero": "string (max 8 words, bold headline)",
    "subtext": "string (max 25 words, explains the value prop)",
    "cta": "string (max 4 words, action button text)"
  },
  "pricingCopy": {
    "tier1": "string (free tier name + one-line description)",
    "tier2": "string (pro tier name + one-line description)",
    "tier3": "string (enterprise tier name + one-line description)"
  },
  "twitterThread": [
    "Tweet 1: Hook (max 280 chars)",
    "Tweet 2: Problem (max 280 chars)",
    "Tweet 3: Solution (max 280 chars)",
    "Tweet 4: How it works (max 280 chars)",
    "Tweet 5: CTA (max 280 chars)"
  ],
  "productHunt": {
    "tagline": "string (max 60 chars)",
    "description": "string (max 260 chars, what it does and why it matters)"
  }
}

Make every element feel specific to the idea. Colors should match the mood and industry of the startup. Copy should be sharp and non-generic.`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];
};

export default groq;
