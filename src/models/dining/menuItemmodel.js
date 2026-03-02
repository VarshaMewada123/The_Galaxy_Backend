const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiningCategory",
      required: true,
      index: true,
    },
    cuisineType: {
      type: String,
      enum: [
        "Punjabi",
        "Rajasthani",
        "Gujarati",
        "Fast Food",
        "Chinese",
        "Other",
      ],
      index: true,
      default: "Other",
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    taxPercent: {
      type: Number,
      default: 5,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    isVeg: {
      type: Boolean,
      default: true,
      index: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    availabilityReason: {
      type: String,
      enum: ["MANUAL", "OUT_OF_STOCK", "KITCHEN_BUSY"],
      default: "MANUAL",
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    preparationTime: {
      type: Number,
      default: 15,
    },
    spiceLevel: {
      type: String,
      enum: ["MILD", "MEDIUM", "SPICY"],
      default: "MEDIUM",
    },
    ingredients: [String],
    allergens: [String],
  },
  { timestamps: true },
);

menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("MenuItem", menuItemSchema);
