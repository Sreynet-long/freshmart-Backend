export const productTypeDefs = `#graphql
    type Product {
        id: ID!
        productName: String
        category: Category
        imageUrl: String
        desc: String
        price: Float

        averageRating: Float
        reviewsCount: Int
        
    }
    type ProductPaginator{
        data: [Product]
        paginator: Paginator
    }
    enum Category {
        Vegetable,
        Sneack_and_Bread,
        Fruit,
        Meats,
        Milk_and_Diary,
        Seafood,
        Drinks,
        Frozen_Food,
    }

    input ProductInput{
        productName: String
        category: Category
        imageUrl: String
        desc: String
        price: Float
        
    }
    

    type Query {
        getProductsByCategory(category: Category!): [Product!]!
        getAllproducts: [Product]
        getProductById(_id: ID!): Product 
        getProductWithPagination(page: Int, limit: Int, pagination: Boolean, keyword: String, category: Category): ProductPaginator
        getProducts(category: String, page: Int, limit: Int): [Product!]!
        
        
    }
    type Mutation {
        createProduct(input: ProductInput): ResponseMessage
        updateProduct(_id: ID!, input: ProductInput): ResponseMessage
        deleteProduct(_id: ID!): ResponseMessage
        
    }

`;
