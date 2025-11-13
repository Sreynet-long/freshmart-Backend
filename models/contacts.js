import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const contactSchema = new mongoose.Schema(
  {
    contactName: String,
    email: String,
    subject: String,
    message: String,
    reply: String, // admin reply
    status: { type: String, default: "New" }, // New / Pending / Resolved
    receivedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

contactSchema.plugin(paginate);
const Contact = mongoose.model("contact", contactSchema);
export { Contact };
