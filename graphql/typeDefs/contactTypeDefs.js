export const contactTypeDefs = `#graphql

    type Contact {
        id: ID!
        contactName: String
        email: String
        subject: String
        message: String
        reply: String
        status: String
        receivedAt: String
        updatedAt: String
    }
    type ContactPaginator{
        data: [Contact]
        paginator: Paginator
    }
    input ContactFormInput {
        contactName: String
        email: String
        subject: String
        message: String
    }
    type Query{
        getAllContacts: [Contact]
        getContactById(_id: ID!): Contact 
        getContactWithPagination(page: Int, limit: Int, pagination: Boolean, keyword: String, subject: String): ContactPaginator
    }
    type Mutation {
        submitContactForm(input: ContactFormInput) : ResponseMessage
        replyContact(contactId: ID!, message: String!): ResponseMessage
    }
`;
