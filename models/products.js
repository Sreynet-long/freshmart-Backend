import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema({ 
    productName: String,
    category: {
        type: "String",
        enum: ["Vegetable", "Sneack_and_Bread", "Fruit", "Meats","Milk_and_Diary","Seafood","Drinks","Frozen_Food" ],
        // require: true,
    },
    imageUrl: String,
    desc: String,
    price: Number,
});
productSchema.plugin(paginate)
const Product = mongoose.model('product', productSchema);
export {Product}