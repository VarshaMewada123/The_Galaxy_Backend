const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: Number,
        price: Number,
      },
    ],

    address: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },

    pricing: {
      subtotal: Number,
      taxes: Number,
      total: Number,
    },

    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber =
      "GX" + Date.now().toString().slice(-8);
  }
  //next();
});

module.exports = mongoose.model("UserOrder", orderSchema);