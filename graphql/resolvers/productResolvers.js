import { Product } from "../../models/products.js";
import {
  ResponseMessage,
  ResponseMessageCustomizse,
} from "../../function/responseMessage.js";
import { paginationLabel } from "../../function/paginateFn.js";
import cloudinary from "../../config/cloudinary.js";

export const productResolvers = {
  Query: {
    //   getProductsByCategory: async (_, { category }) => {
    //     try {
    //       const products = await Product.find({ category });
    //       return products;
    //     } catch (error) {
    //       console.error("Error fetching products by category:", error);
    //       return [];
    //     }
    //   },

    getProductsByCategory: async (_, { category }) => {
      if (!category) return [];
      return await Product.find({ category });
    },

    getProductById: async (_, { _id }) => {
      // console.log(_id);
      const getProduct = await Product.findById(_id);
      // console.log(getProduct);
      return getProduct;
    },
    getAllproducts: async (_, {}) => {
      // return await Product.find();
      const getAllProduct = await Product.find();
      // console.log("getAllProduct",getAllProduct)
      return getAllProduct;
    },
    getProductWithPagination: async (
      _,
      { page, limit, pagination, keyword, category }
    ) => {
      try {
        const options = {
          page: page || 1,
          limit: limit || 10,
          customLabels: paginationLabel,
          pagination: pagination,
        };
        const query = {
          $and: [
            // 1. Keyword search (case-insensitive regex on 'name')
            { productName: { $regex: keyword || "", $options: "i" } },

            // 2. Category filter (conditionally added)
            category ? { category: category } : {},
          ],
        };

        const productData = await Product.paginate(query, options);

        return productData;
      } catch (error) {
        console.error("Error in getProductWithPagination:", error);
        return {
          data: [],
          paginator: {
            totalDocs: 0,
            totalPages: 0,
            currentPage: page || 1,
            perPage: limit || 10,
          },
        };
      }
    },
  },
  Mutation: {
    createProduct: async (_, { input }, { req }) => {
      try {
        // if (!user || user.role !== "admin"){
        //   throw new Error("Not authorized");
        // }
        // const currentUser = await AuthCheck(req)
        // console.log(currentUser, "currentUser")
        //search keyword
        const isExist = await Product.findOne({
          productName: input.productName,
        });
        // if (isExist) {
        //   return {
        //     isSuccess: false,
        //     messageEn: "Already exist!",
        //     messageKh: "ទិន្នន័យស្ទួន",
        //     product: null,
        //   }
        // }

        if (isExist) {
          return ResponseMessageCustomizse(
            false,
            "ទិន្នន័យស្ទួន",
            "Already exist!",
            null
          );
        }

        // Save product with Cloudinary image Url
        const product = new Product(input);
        await product.save();
        // console.log("save product", product);
        //create
        // await new Product(input).save();
        // const createData = await new Product(input).save()

        // return ResponseMessage(true);
        return ResponseMessageCustomizse(
          true,
          "បង្កើតទំនិញជោគជ័យ",
          "Product created successfully!",
          product
        );
        // return {
        //     isSuccess: true,
        //     messageKh: "បង្កើតទំនិញជោគជ័យ",
        //     messageEn: "Product created successfully!",
        //     product,
        // }
      } catch (error) {
        console.log(error);
        // return ResponseMessageCustomizse(false, error.message, error.message);
        // return ResponseMessage(false)
        return ResponseMessageCustomizse(
          false,
          "បង្កើតទំនិញបរាជ័យ",
          "Product create failed!",
          null
        );
        // return {
        //     isSuccess: false,
        //     messageKh: "បង្កើតទំនិញបរាជ័យ",
        //     messageEn: "Product create failed!",
        //     product: null,
        // }
      }
    },
    updateProduct: async (_, { _id, input }) => {
      try {
        const existingProduct = await Product.findById(_id);
        if (!existingProduct) {
          return ResponseMessageCustomizse(
            false,
            "រកមិនឃើញផលិតផល",
            "Product not found",
            null
          );
          // return {
          //   isSuccess: false,
          //   messageEn: "Product not found",
          //   messageKh: "រកមិនឃើញផលិតផល",
          //   product: null,
          // };
        }

        // ✅ Guard: if frontend sends undefined, null, or "", preserve the old value
        if (
          input.imagePublicId === undefined ||
          input.imagePublicId === null ||
          input.imagePublicId === ""
        ) {
          input.imagePublicId = existingProduct.imagePublicId;
        }

        // ✅ If a new imagePublicId is provided and different, delete old Cloudinary image
        if (
          input.imagePublicId &&
          existingProduct.imagePublicId &&
          input.imagePublicId !== existingProduct.imagePublicId
        ) {
          await cloudinary.uploader.destroy(existingProduct.imagePublicId);
          // console.log(
          //   "Deleted old Cloudinary image:",
          //   existingProduct.imagePublicId
          // );
        }

        const updatedProduct = await Product.findByIdAndUpdate(_id, input, {
          new: true,
        });
        // console.log("updated Product:", updatedProduct);
        // const updateData = await Product.findByIdAndUpdate(_id, input)

        // return ResponseMessage(true);

        return ResponseMessageCustomizse(
          true,
          "កែប្រែទំនិញជោគជ័យ",
          "Product updated successfully!",
          updatedProduct
        );
        // return {
        //     isSuccess: true,
        //     messageKh: "កែប្រែទំនិញជោគជ័យ",
        //     messageEn: "Product updated successfully!",
        //     product: updatedProduct,
        // }
      } catch (error) {
        // return ResponseMessage(false);
        return ResponseMessageCustomizse(
          false,
          "កែប្រែទំនិញបរាជ័យ",
          "Product updated failed!",
          null
        );
        // return {
        //     isSuccess: false,
        //     messageKh: "កែប្រែទំនិញបរាជ័យ",
        //     messageEn: "Product updated failed!",
        //     product: null,
        // }
      }
    },

    async deleteProduct(_, { _id, imagePublicId }) {
      try {
        const existingProduct = await Product.findById(_id);
        if (!existingProduct) {
          return ResponseMessageCustomizse(
            false,
            "រកមិនឃើញផលិតផល",
            "Product not found",
            null
          );
        }
        const publicIdToDelete = imagePublicId || existingProduct.imagePublicId;
        // Always delete the Cloudinary image if product has a publicId
        if (publicIdToDelete) {
          // console.log("Deleting Cloudinary image:", publicIdToDelete);
          const result = await cloudinary.uploader.destroy(publicIdToDelete, {
            resource_type: "image",
          });
          // console.log("Cloudinary destroy result:", result);
        }
        // console.log("Deleting:", publicIdToDelete);
        // ✅ Then delete the product from MongoDB
        const deleted = await Product.findByIdAndDelete(_id);
        // console.log("deletedProduct:", deleted);
        // if (!deleted) {
        //   return ResponseMessageCustomizse(
        //     false,
        //     "រកមិនឃើញផលិតផល",
        //     "Product not found",
        //     null
        //   );
        // }

        return ResponseMessageCustomizse(
          true,
          "ផលិតផលត្រូវបានលុបដោយជោគជ័យ",
          "Product deleted successfully",
          deleted
        );

        // return {
        //   isSuccess: true,
        //   messageEn: "Product deleted successfully",
        //   messageKh: "ផលិតផលត្រូវបានលុបដោយជោគជ័យ",
        // };
      } catch (err) {
        console.error("Delete error:", err);
        return ResponseMessageCustomizse(
          false,
          "មានបញ្ហាក្នុងការលុប",
          err.message
        );

        // return {
        //   isSuccess: false,
        //   messageEn: err.message,
        //   messageKh: "មានបញ្ហាក្នុងការលុប",
        // };
      }
    },
  },
};
