
export const reviewTypeDefs = `#graphql
    type Review {
        id: ID!
        name: String
        rating: Float
        comment: String
        product: Product
        createdAt: String
    }

    type ReviewPaginator{
        data: [Review]
        paginator: Paginator
    }
    input ReviewInput {
        name: String!
        rating: Float!
        comment: String!
        productId: ID!
    }

    type Query {
        getReviewsByProduct(productId: ID!): [Review]
        getReviewWithPagination(page: Int, limit: Int, pagination: Boolean, keyword: String):ReviewPaginator
    }

    type Mutation {
        createReview(input: ReviewInput!): ResponseMessage
    }
`;
