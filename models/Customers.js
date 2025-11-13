import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const customerSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  address: String,
  totalOrders: Number,
  totalSpent: Number,
  status: Boolean,
  createdAt: String,
});

customerSchema.plugin(paginate);
const Customer = mongoose.model("Customer", customerSchema);
export { Customer };
