// schema/notification.js


export const contactTypeDefs = `#graphql
  type Notification {
  id: ID!
  message: String!
  orderId: ID
  isRead: Boolean!
  createdAt: String!
}

type Query {
  getNotifications(page: Int = 1, limit: Int = 10, unreadOnly: Boolean = false): [Notification!]!
  getNotificationCount(unreadOnly: Boolean = true): Int!
}

type Mutation {
  markNotificationRead(notificationId: ID!): Notification!
  markAllNotificationsRead: Int!
}

type Subscription {
  newOrderNotification: Notification!
}

`;
