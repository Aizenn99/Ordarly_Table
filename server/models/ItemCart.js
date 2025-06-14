const mongoose = require("mongoose");

const itemCartSchema = new mongoose.Schema(
  {
    tableName: {
      type: String,
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem", // assumes a MenuItem schema exists
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("ItemCart", itemCartSchema);
