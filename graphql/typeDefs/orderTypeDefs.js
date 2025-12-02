export const orderTypeDefs = `#graphql
  type OrderItem {
    product: Product
    quantity: Int!
    price: Float
  }

  type ShippingInfo {
    name: String
    phone: String
    email: String
    address: String
    country: String
  }

  type Order {
    id: ID
    userId: ID
    shippingInfo: ShippingInfo
    items: [OrderItem]
    totalPrice: Float
    status: String
    paymentMethod: String
    paymentProof: String
    createdAt: String
    isHidden: Boolean
    isDeleted: Boolean
  }

  type OrderPaginator {
    data: [Order]
    paginator: Paginator
  }

  input ShippingInfoInput {
    name: String
    phone: String
    email: String
    address: String
    country: String
  }

  input OrderItemInput {
    productId: ID
    quantity: Int
    price: Float
  }
  type Subscription {
  orderCreated: Order
  orderStatusUpdated: Order
}


  input OrderInput {
    userId: ID
    shippingInfo: ShippingInfoInput
    items: [OrderItemInput]
    paymentMethod: String
    paymentProof: String
  }
  type Notification {
    id: ID
    userId: ID
    message: String
    orderId: ID
    type: String
    createdAt: String
  }

  type Query {
    getOrders(userId: ID!, filterHidden: Boolean): [Order]
    getOrderById(_id: ID!): Order
    getOrdersWithPagination(
      page: Int
      limit: Int
      pagination: Boolean
      keyword: String
      status: String
    ): OrderPaginator
  }

  type Mutation {
    hideOrder(orderId: ID!): Order
    createOrder(input: OrderInput!): ResponseMessage
    cancelOrder(orderId: ID!): Order
    updateOrderStatus(_id: ID!, status: String!): ResponseMessage
    deleteOrder(_id: ID!): ResponseMessage
    proceedToCheckout(
      userId: ID!
      shippingInfo: ShippingInfoInput
      items: [OrderItemInput]
      paymentMethod: String
      paymentProof: String
    ): ResponseMessage
  }
`;
