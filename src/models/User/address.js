// const mongoose = require("mongoose");

// const addressSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true
//     },

//     street: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 3,
//       maxlength: 200
//     },

//     landmark: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 3,
//       maxlength: 200
//     },

//     city: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true
//     },

//     pincode: {
//       type: String,
//       required: true,
//       match: /^[1-9][0-9]{5}$/,
//       index: true
//     },

//     label: {
//       type: String,
//       enum: ["Home", "Work", "Other"],
//       default: "Home"
//     },

//     isDefault: {
//       type: Boolean,
//       default: false,
//       index: true
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// addressSchema.index({ user: 1, createdAt: -1 });

// module.exports = mongoose.model("Address", addressSchema);


const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    street: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200
    },

    landmark: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200
    },

    label: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home"
    },

    isDefault: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

addressSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Address", addressSchema);