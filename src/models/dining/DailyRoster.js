const mongoose = require("mongoose");

const dailyRosterSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
      // ❌ removed index:true
    },

    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
      },
    ],

    notes: {
      type: String,
      maxlength: 500,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

/*
 ✅ one roster per day only
*/
dailyRosterSchema.index({ date: 1 }, { unique: true });

module.exports = mongoose.model("DailyRoster", dailyRosterSchema);