import mongoose from "mongoose";

const PromoCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: {
        type: String,
        enum: ["percentage", "fixed", "full_access"],
        default: "full_access",
    },
    discountValue: { type: Number, default: 0 }, // 100 for full_access
    tier: {
        type: String,
        enum: ["monthly", "quarterly", "yearly"],
        required: true,
    },
    usageLimit: { type: Number, default: 1 }, // Total times this code can be used across all users
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true }, // Admin email
});

// Index to automatically expire codes
PromoCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.PromoCode ||
    mongoose.model("PromoCode", PromoCodeSchema);
