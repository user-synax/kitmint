import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },           // null for OAuth users
  image: { type: String },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  kitsGeneratedThisMonth: { type: Number, default: 0 },
  monthResetDate: { type: Date, default: () => new Date() },
  stripeCustomerId: { type: String },    // For future subscription model
  stripeSubscriptionId: { type: String }, // For future subscription model
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
