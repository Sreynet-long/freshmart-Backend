export const reportTypeDefs = `#graphql
  type DailyRevenue {
    day: String
    revenue: Float
  }

  type TopCategory {
    name: String
    value: Float
  }

  type ReportStats {
    totalRevenue: Float
    totalOrders: Int
    totalUsers: Int
    pendingOrders: Int
    dailyRevenue: [DailyRevenue]
    topCategories: [TopCategory]
  }

  type Query {
    getReportStats(startDate: String!, endDate: String!): ReportStats
  }
`;
