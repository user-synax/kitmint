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
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

KitSchema.index({ isPublic: 1, createdAt: -1 });
KitSchema.index({ userId: 1 });

export default mongoose.models.Kit || mongoose.model('Kit', KitSchema);
