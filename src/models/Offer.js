const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FLAT"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
    },

    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
      },
    ],

    combos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Combo",
      },
    ],

    // ✅ IMAGE FIELD
    image: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("OfferDining", offerSchema);
