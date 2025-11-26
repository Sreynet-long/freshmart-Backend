import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const ShippingInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  country: { type: String, default: "Cambodia" },
});

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    shippingInfo: { type: ShippingInfoSchema, required: true },
    items: { type: [OrderItemSchema], required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, default: "Pending" },
    paymentMethod: { type: String, default: "cash" }, // added
    paymentProof: { type: String }, // Base64 image
  },
  { timestamps: true }
);

OrderSchema.plugin(paginate);

export const Order = mongoose.model("Order", OrderSchema);
