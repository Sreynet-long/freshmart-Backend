export const userTypeDefs = `#graphql
    type User {
        id: ID!
        username: String
        phoneNumber: String
        email: String
        password: String
        checked: Boolean
        token: String
        role: String
        createdAt: String
        updatedAt: String
    }
    type UserInput {
        username: String
        phoneNumber: String
        email: String

    }

    type UserPaginator {
        data: [User]
        paginator: Paginator
    }

    type LoginData {
        isSuccess: Boolean
        messageKh: String
        messageEn: String
        data: User
    }

    input UserSignUpInput {
        username: String
        phoneNumber: String
        email: String
        password: String    
        checked: Boolean
        role: String
    }

    input UserUpdateInput {
        username: String
        phoneNumber: String
        email: String
        checked: Boolean
    }
    input UserLoginInput {
        email: String
        password: String
    }

    type ResponseMessage {
        isSuccess: Boolean
        messageKh: String
        messageEn: String
    }

    type Query {
        getAdmins: [User] 
        getAllUsers: [User]
        getUserbyId(_id: ID!): User
        getUserWithPagination(page: Int, limit: Int, pagination: Boolean, keyword: String): UserPaginator
    }

    type Mutation {
        signupUserForm(input: UserSignUpInput) : LoginData
        loginUserForm(input: UserLoginInput) : LoginData
        forgotPassword(email: String!): ResponseMessage!
        resetPassword(token: String!, newPassword: String!): ResponseMessage!

 
        updateUser(_id: ID!, input: UserUpdateInput): ResponseMessage
        updateUserStatus(_id: ID!, checked: Boolean!): ResponseMessage
        deleteUser(_id: ID!): ResponseMessage
    }
`;
