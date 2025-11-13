import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2"

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: false },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
notificationSchema.plugin(paginate)
const Notification = mongoose.model('notification', notificationSchema);
export {Notification}