const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    billNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    tableName: {
      type: String,
      required: true,
    },
    spaceName: {
      type: String,
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
    },
    items: [
      {
        itemName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    charges: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["CASH", "CARD", "UPI", "CREDIT"],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PAID", "UNPAID"],
      default: "UNPAID",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
     createdBy: {
    type: String,
    required: false, // or true if you want to enforce
  },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Bill", billSchema);
