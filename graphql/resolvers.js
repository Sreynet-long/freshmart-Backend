import { contactResolvers } from "./resolvers/contactResolvers.js";
import { dashboardResolvers } from "./resolvers/dashboardResolvers.js";
import { orderResolvers } from "./resolvers/orderResolvers.js";
import {productResolvers} from "./resolvers/productResolvers.js"
import { reportResolvers } from "./resolvers/reportResolvers.js";
import { reviewResolvers } from "./resolvers/reviewResolvers.js";
import { userResolvers } from "./resolvers/userResolvers.js";


export const resolvers = {
  Query: {
    ...productResolvers.Query,
    ...contactResolvers.Query,
    ...userResolvers.Query,
    ...reviewResolvers.Query,
    ...orderResolvers.Query,
    ...dashboardResolvers.Query,
    ...reportResolvers.Query,
  },
  Mutation: {
    ...productResolvers.Mutation,
    ...contactResolvers.Mutation, 
    ...userResolvers.Mutation,
    ...reviewResolvers.Mutation,
    ...orderResolvers.Mutation,
  },
};