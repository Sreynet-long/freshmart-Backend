import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const reviewSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    comment: String,
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    },
    createdAt: String, 
})
reviewSchema.plugin(paginate)
const Review = mongoose.model('review', reviewSchema);
export {Review}