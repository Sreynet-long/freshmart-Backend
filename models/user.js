import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema({
    username: String,
    phoneNumber: String,
    email: String,
    password: String,
    checked: Boolean,
    role: { type: String, default: "Customer" },
    token: String,
    resetToken: String,
    resetTokenExpiry: Date,
    
} , { timestamps: true });
userSchema.plugin(paginate)
const User = mongoose.model('user', userSchema);
export {User}