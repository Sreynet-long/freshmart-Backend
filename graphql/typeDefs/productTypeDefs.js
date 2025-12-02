export const productTypeDefs = `#graphql
type Product {
  id: ID!
  productName: String
  category: Category
  imageUrl: String
  imagePublicId: String
  desc: String
  price: Float
  averageRating: Float
  reviewsCount: Int
}

type ProductPaginator {
  data: [Product]
  paginator: Paginator
}

enum Category {
  Vegetable
  Sneack_and_Bread
  Fruit
  Meats
  Milk_and_Diary
  Seafood
  Drinks
  Frozen_Food
}

input ProductInput {
  productName: String
  category: Category
  imageUrl: String
  imagePublicId: String
  desc: String
  price: Float
}

type CreateProductResponse {
  isSuccess: Boolean!
  messageEn: String
  messageKh: String
  product: Product
}

type UpdateProductResponse {
  isSuccess: Boolean!
  messageEn: String
  messageKh: String
  product: Product
}

type DeleteProductResponse {
  isSuccess: Boolean!
  messageEn: String
  messageKh: String
  product: Product
}

type Query {
  searchProducts(query: String!, category: String, limit: Int, page: Int): [Product!]
  getProductsByCategory(category: Category!): [Product!]!
  getAllproducts: [Product]
  getProductById(_id: ID!): Product
  getProductWithPagination(
    page: Int
    limit: Int
    pagination: Boolean
    keyword: String
    category: Category
  ): ProductPaginator
  getProducts(category: String, page: Int, limit: Int): [Product!]!
}

type Mutation {
  createProduct(input: ProductInput!): CreateProductResponse
  updateProduct(_id: ID!, input: ProductInput!): UpdateProductResponse
  deleteProduct(_id: ID!, imagePublicId: String): DeleteProductResponse
}
`;
