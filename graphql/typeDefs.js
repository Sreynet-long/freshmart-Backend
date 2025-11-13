import { contactTypeDefs } from "./typeDefs/contactTypeDefs.js";
import { productTypeDefs } from "./typeDefs/productTypeDefs.js";
import { globalTypeDefs } from "./typeDefs/globalTypeDefs.js";
import { userTypeDefs } from "./typeDefs/userTypeDefs.js";
import {reviewTypeDefs} from "./typeDefs/reviewTypeDefs.js";
import { orderTypeDefs } from "./typeDefs/orderTypeDefs.js";
import { dashboardTypeDefs } from "./typeDefs/dashboardTypeDefs.js";
import {reportTypeDefs} from "./typeDefs/reportTypeDefs.js";

export const typeDefs= [
  globalTypeDefs,
  productTypeDefs,
  contactTypeDefs,
  userTypeDefs,
  reviewTypeDefs,
  orderTypeDefs,
  dashboardTypeDefs,
  reportTypeDefs,
];