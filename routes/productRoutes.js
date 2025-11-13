import express from "express";
import { Product } from "../models/products.js";

const router = express.Router();

/**
 * Get products by category with pagination
 * GET /api/products/category/:slug?page=1&limit=8
 */
router.get("/category/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;

    const slugToCategoryEnum = {
      "vegetable": "Vegetable",
      "snacks-breads": "Sneack_and_Bread",
      "fruits": "Fruit",
      "meats": "Meats",
      "milk-dairy": "Milk_and_Diary",
      "seafood": "Seafood",
      "drinks": "Drinks",
      "frozen-food": "Frozen_Food"
    };

    const categoryEnum = slugToCategoryEnum[slug];
    if (!categoryEnum) {
      return res.status(404).json({ isSuccess: false, message: "Category not found" });
    }

    const options = {
      page,
      limit,
      sort: { productName: 1 },
    };

    const result = await Product.paginate({ category: categoryEnum }, options);

    return res.json({
      isSuccess: true,
      data: result.docs,
      totalPages: result.totalPages,
      page: result.page,
    });
  } catch (error) {
    return res.status(500).json({ isSuccess: false, message: error.message });
  }
});

export default router;
