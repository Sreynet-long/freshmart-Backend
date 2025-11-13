import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2"

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
});

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [CartItemSchema],
});

CartSchema.plugin(paginate)
const Cart = mongoose.model('cart',CartSchema)
export {Cart}