import { Product } from "../../models/products.js";
import {
  ResponseMessage,
  ResponseMessageCustomizse,
} from "../../function/responseMessage.js";
import { paginationLabel } from "../../function/paginateFn.js";

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
        // const currentUser = await AuthCheck(req)
        // console.log(currentUser, "currentUser")
        //search keyword
        const isExist = await Product.findOne({
          productName: input.productName,
        });
        if (isExist) {
          return ResponseMessageCustomizse(
            false,
            "ទិន្នន័យស្ទួន",
            "Already exist!"
          );
        }
        //create
        await new Product(input).save();
        // const createData = await new Product(input).save()

        return ResponseMessage(true);
        // return ResponseMessageCustomizse(true, "បង្កើតទំនិញជោគជ័យ", "Product created successfully!")
        // return {
        //     isSuccess: true,
        //     messageKh: "បង្កើតទំនិញជោគជ័យ",
        //     messageEn: "Product created successfully!"
        // }
      } catch (error) {
        console.log(error);
        return ResponseMessageCustomizse(false, error.message, error.message);
        // return ResponseMessage(false)
        // return ResponseMessageCustomizse(false, "បង្កើតទំនិញបរាជ័យ", "Product create failed!")
        // return {
        //     isSuccess: false,
        //     messageKh: "បង្កើតទំនិញបរាជ័យ",
        //     messageEn: "Product create failed!"
        // }
      }
    },
    updateProduct: async (_, { _id, input }) => {
      try {
        await Product.findByIdAndUpdate(_id, input);
        // const updateData = await Product.findByIdAndUpdate(_id, input)

        return ResponseMessage(true);

        // return ResponseMessage(true, "កែប្រែទំនិញជោគជ័យ", "Product updated successfully!")
        // return {
        //     isSuccess: true,
        //     messageKh: "បង្កើតទំនិញជោគជ័យ",
        //     messageEn: "Product created successfully!"
        // }
      } catch (error) {
        return ResponseMessage(false);
        // return ResponseMessage(false, "កែប្រែទំនិញបរាជ័យ", "Product updated failed!")
        // return {
        //     isSuccess: false,
        //     messageKh: "បង្កើតទំនិញបរាជ័យ",
        //     messageEn: "Product created failed!"
        // }
      }
    },
    deleteProduct: async (_, { _id }) => {
      try {
        await Product.findByIdAndDelete(_id);
        // const deleteData = await Product.findByIdAndDelete(_id)
        return ResponseMessage(true);
      } catch (error) {
        return ResponseMessage(false);
      }
    },
  },
};
