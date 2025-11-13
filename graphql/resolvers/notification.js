import { PubSub } from "graphql-subscriptions";
import { Notification } from "../../models/notification.js";

const pubsub = new PubSub();
const NEW_ORDER_TOPIC = "NEW_ORDER_TOPIC";

export const resolvers = {
  Query: {
    getNotifications: async (_, { page = 1, limit = 10, unreadOnly = false }) => {
      const options = {
        page,
        limit,
        sort: { createdAt: -1 },
      };
      const query = unreadOnly ? { isRead: false } : {};

      const result = await Notification.paginate(query, options);
      return result.docs;
    },

    getNotificationCount: async (_, { unreadOnly = true }) => {
      const query = unreadOnly ? { isRead: false } : {};
      return Notification.countDocuments(query);
    }
  },

  Mutation: {
    markNotificationRead: async (_, { notificationId }) => {
      return Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );
    },

    markAllNotificationsRead: async () => {
      const res = await Notification.updateMany(
        { isRead: false },
        { isRead: true }
      );
      return res.modifiedCount || 0;
    }
  },

  Subscription: {
    newOrderNotification: {
      subscribe: () => pubsub.asyncIterator([NEW_ORDER_TOPIC])
    }
  }
};

export { pubsub, NEW_ORDER_TOPIC };



    