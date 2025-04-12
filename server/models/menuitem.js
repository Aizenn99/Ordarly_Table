const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
  {
    imageURL: {
      type: String,
      default: null,
    },
    title: String,
    description: String,
    category: String,
    subcategory: String,
    price: Number,
  },
  {
    timestamps: true,
  }
);

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    subcategories: [String],
  },
  {
    imageURL: String,
    default: null,
  },
  {
    timestamps: true,
  }
);
const SubcategorySchema = new mongoose.Schema(
  {
    name: String,
    category: String,
  },
  {
    timestamps: true,
  }
);

//create different models for each schema


module.exports = mongoose.model("Category", CategorySchema);
module.exports = mongoose.model("Subcategory", SubcategorySchema);
module.exports = mongoose.model("MenuItem", MenuItemSchema);
