const mongoose = require("mongoose");

const diningCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      maxlength: 500,
    },

    image: String,

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
);

diningCategorySchema.index({ sortOrder: 1, createdAt: -1 });

module.exports = mongoose.model("DiningCategory", diningCategorySchema);
