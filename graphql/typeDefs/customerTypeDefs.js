export const customerTypeDefs = `#graphql
    type Customer {
        id: ID!
        fullName: String
        email: String
        phone: String
        address: String
        totalOrders: Float
        totalSpent: Float
        createdAt: String
    }
    type CustomerPaginator{
        data: [Customer]
        paginator: Paginator
    }
    type CustomerInput {
        fullName: String!
        email: String!
        phone: String!
        address: String!
        totalOrders: Float!
        totalSpent: Float!
        createdAt: String!
    }
    type Query {
        getCustomerWithPagination(page: Int, limit: Int , pagination: Boolean, keyword: String): CustomerPaginator
        getCutomerById(_id: ID!) : Customer
    }
    type Mutation {
        createCustomer(input: CustomerInput): ResponseMessage
        updateCustomer(_id: ID!, Input: CustomerInput): ResponseMessage
        deleteCustomer(_id: ID!): ResponseMessage
    }
`;
