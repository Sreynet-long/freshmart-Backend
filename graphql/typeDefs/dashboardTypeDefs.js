export const dashboardTypeDefs = `#graphql
  type RevenueDay {
    day: String
    revenue: Float
  }

  type UserGrowth {
    day: String
    count: Int
  }

  type CategoryStat {
    name: String
    value: Float
  }

  type DashboardStats {
    totalSales: Float
    totalOrders: Int
    totalUsers: Int
    allTimePendingOrders: Int
    currentPendingOrders: Int   
    dailyRevenue: [RevenueDay]
    newUsers: [UserGrowth]
    topCategories: [CategoryStat]
  }

  type Query {
    getDashboardStats(startDate: String!, endDate: String!): DashboardStats
  }
`;
