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
    productHunt: `{ "productHunt": { "tagline": "string", "description": "string" } }`
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
