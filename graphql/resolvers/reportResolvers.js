import { Order } from "../../models/order.js";
import { User } from "../../models/user.js";
import dayjs from "dayjs";

export const reportResolvers = {
  Query: {
    getReportStats: async (_, { startDate, endDate }) => {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Fetch orders in date range
      const orders = await Order.find({ createdAt: { $gte: start, $lte: end } });

      // --- Total Revenue ---
      const totalRevenue = orders.reduce((sum, o) => {
        let amt = Number(o.totalAmount);
        if (isNaN(amt) || amt <= 0) {
          // Fallback: sum items price * quantity
          amt = (o.items || []).reduce(
            (s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0),
            0
          );
        }
        return sum + amt;
      }, 0);

      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === "pending").length;

      // --- Total Users ---
      const totalUsers = await User.countDocuments({
        createdAt: { $gte: start, $lte: end },
      });

      // --- Daily Stats ---
      const dailyMap = {};
      orders.forEach(order => {
        const day = dayjs(order.createdAt).format("YYYY-MM-DD");

        let amt = Number(order.totalAmount);
        if (isNaN(amt) || amt <= 0) {
          amt = (order.items || []).reduce(
            (s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0),
            0
          );
        }

        if (!dailyMap[day]) dailyMap[day] = { revenue: 0, count: 0 };
        dailyMap[day].revenue += amt;
        dailyMap[day].count += 1;
      });

      const dailyRevenue = Object.keys(dailyMap).map(day => ({
        day,
        revenue: dailyMap[day].revenue,
        orderCount: dailyMap[day].count,
        avgOrderValue:
          dailyMap[day].count > 0
            ? dailyMap[day].revenue / dailyMap[day].count
            : 0,
      }));

      // --- Top Categories ---
      const categoryMap = {};
      orders.forEach(order => {
        (order.items || []).forEach(item => {
          const categoryName = item.category || "Unknown";
          const qty = Number(item.quantity) || 0;
          categoryMap[categoryName] = (categoryMap[categoryName] || 0) + qty;
        });
      });

      const topCategories = Object.keys(categoryMap)
        .map(name => ({ name, value: categoryMap[name] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10); // Top 10 categories

      return {
        totalRevenue,
        totalOrders,
        totalUsers,
        pendingOrders,
        dailyRevenue,
        topCategories,
      };
    },
  },
};
