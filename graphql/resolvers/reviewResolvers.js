import {
  ResponseMessage,
  ResponseMessageCustomizse,
} from "../../function/responseMessage.js";
import { paginationLabel } from "../../function/paginateFn.js";
import { Review } from "../../models/reviews.js";
import { Product } from "../../models/products.js";
import { get } from "mongoose";

export const reviewResolvers = {
  Query: {
    async getReviewsByProduct(_, { productId }) {
      try {
        console.log("Getting reviews for product:", productId);
        const reviews = await Review.find({ productId })
          .populate("productId")
          .sort({ createdAt: -1 });
          console.log("Reviews found:", reviews.length);
        return reviews;
      } catch (error) {
        console.error("Error fetching reviews:", error.message);
        throw new Error("Failed to get reviews");
      }
    },

    getReviewWithPagination: async (
      _,
      { page, limit, pagination, keyword }
    ) => {
      try {
        console.log("Fetching reviews with pagination...");

        const options = {
          page: page || 1,
          limit: limit || 10,
          customLabels: paginationLabel,
          pagination: pagination,
        };
        const query = { name: { $regex: keyword, $options: "i" } };

        const reviewData = await Review.paginate(query, options);
        return reviewData;
      } catch (error) {
        console.error("Failed to get products", error);
      }
    },
  },

  Mutation: {
    async createReview(_, { input }) {
      try {
        console.log("Adding review:", input);
        const review = new Review({
          ...input,
          createdAt: new Date().toISOString(),
        });
        await review.save();
        return ResponseMessageCustomizse(
          true,
          "បានបន្ថែមការវាយតម្លៃដោយជោគជ័យ",
          "Review added successfully"
        );
      } catch (error) {
        console.error("Error adding review:", error.message);
        return ResponseMessageCustomizse(
          false,
          "បរាជ័យក្នុងការបន្ថែមការវាយតម្លៃ",
          "Failed to add review"
        );
      }
    },
  },

  Review: {
    async product(parent) {
      try {
        return await Product.findById(parent.productId);
      } catch (error) {
        console.error("Error fetching product for review:", error.message);
        return null;
      }
    },
  },
};
