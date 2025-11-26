import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Vegetable",
        "Sneack_and_Bread",
        "Fruit",
        "Meats",
        "Milk_and_Diary",
        "Seafood",
        "Drinks",
        "Frozen_Food",
      ],
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String, 
      default: "",
    },

    desc: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// Pagination plugin
productSchema.plugin(paginate);
export const Product = mongoose.model("Product", productSchema);
