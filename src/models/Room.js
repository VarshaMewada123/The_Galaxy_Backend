const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },

    description: {
      type: String,
      required: true,
      maxlength: 3000,
    },

    amenities: [String],

    images: [String],

    status: {
      type: String,
      enum: ["available", "hidden"],
      default: "available",
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

roomSchema.index({ price: 1, status: 1 });

module.exports = mongoose.model("Room", roomSchema);
