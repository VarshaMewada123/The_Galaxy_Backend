const mongoose = require("mongoose");
const slugify = require("slugify");

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
      unique: true,
      lowercase: true,
      index: true,
    },
    description: { type: String, maxlength: 500 },
    image: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

diningCategorySchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

diningCategorySchema.index({ sortOrder: 1, createdAt: -1 });

module.exports = mongoose.model("DiningCategory", diningCategorySchema);
