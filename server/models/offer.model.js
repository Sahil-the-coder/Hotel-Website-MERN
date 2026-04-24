import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    priceOff: { type: Number, required: true, min: 1, max: 90 },
    expiryDate: { type: Date, required: true },
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    applicableScope: {
      type: String,
      enum: ["all", "india", "international"],
      default: "all",
    },
  },
  { timestamps: true }
);

const Offer = mongoose.models.offer || mongoose.model("offer", offerSchema);

export default Offer;
