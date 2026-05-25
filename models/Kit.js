import mongoose from 'mongoose';

const BrandNameSchema = new mongoose.Schema({
  name: String,
  reason: String
}, { _id: false });

const ColorSchema = new mongoose.Schema({
  hex: String,
  name: String,
  role: String
}, { _id: false });

const KitSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isPublic: { type: Boolean, default: false },
  ideaPrompt: { type: String, required: true },
  brandNames: [BrandNameSchema],
  tagline: { type: String },
  colors: [ColorSchema],
  fonts: { heading: String, body: String, pairing_reason: String },
  landingCopy: { hero: String, subtext: String, cta: String },
  pricingCopy: { tier1: String, tier2: String, tier3: String },
  twitterThread: [String],
  productHunt: { tagline: String, description: String },
  userPersonas: [{ name: String, description: String, painPoint: String }],
  logoPrompts: [String],
  socialBios: { instagram: String, tiktok: String, twitter: String },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

KitSchema.index({ isPublic: 1, createdAt: -1 });
KitSchema.index({ userId: 1 });

// Clear the model from cache to ensure schema changes are picked up during development
if (mongoose.models.Kit) {
  delete mongoose.models.Kit;
}

const Kit = mongoose.model('Kit', KitSchema);
export default Kit;
