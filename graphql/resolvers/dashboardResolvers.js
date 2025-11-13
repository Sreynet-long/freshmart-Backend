import { Order } from "../../models/order.js";
import { User } from "../../models/user.js";
import { Product } from "../../models/products.js";
import dayjs from "dayjs";

export const dashboardResolvers = {
  Query: {
    getDashboardStats: async (_, args) => {
      const { startDate, endDate } = args || {};

      // ✅ Provide fallback dates (current month)
      const start = startDate
        ? dayjs(startDate).startOf("day").toDate()
        : dayjs().startOf("month").toDate();
      const end = endDate
        ? dayjs(endDate).endOf("day").toDate()
        : dayjs().endOf("month").toDate();

      const match = { createdAt: { $gte: start, $lte: end } };

      // Total Orders
      const totalOrders = await Order.countDocuments(match);

      // Total Sales
      const totalSalesAgg = await Order.aggregate([
        { $match: match },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]);
      const totalSales = totalSalesAgg[0]?.total || 0;

      // Total Users (all time)
      const totalUsers = await User.countDocuments();

      // Current Pending Orders
      const currentPendingOrders = await Order.countDocuments({
        ...match,
        status: "Pending",
      });

      // All-Time Pending Orders
      const allTimePendingOrders = await Order.countDocuments({
        status: "Pending",
      });

      // Daily Revenue
      const dailyAgg = await Order.aggregate([
        { $match: match },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      const dailyRevenue = dailyAgg.map((r) => ({
        day: r._id,
        revenue: r.revenue,
      }));

      // New Users per Day
      const userAgg = await User.aggregate([
        { $match: match },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      const newUsers = userAgg.map((u) => ({
        day: u._id,
        count: u.count,
      }));

      // Top Categories
      const topCategoriesAgg = await Order.aggregate([
        { $match: match },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $group: {
            _id: "$product.category",
            total: { $sum: "$items.price" },
          },
        },
        { $sort: { total: -1 } },
        { $limit: 6 },
      ]);

      const topCategories = topCategoriesAgg.map((c) => ({
        name: c._id,
        value: c.total,
      }));

      // Return all stats
      return {
        totalSales,
        totalOrders,
        totalUsers,
        allTimePendingOrders,
        currentPendingOrders,
        dailyRevenue,
        newUsers,
        topCategories,
      };
    },
  },
};
