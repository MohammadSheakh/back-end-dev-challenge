import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    required: false,
    min: 0,
    max: 100,
    default: 0,
  },
  image: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
    enum: ["Stock Out", "In Stock"],
    default: "Stock Out",
  },
  productCode: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true, // Ensure every product has a category
  },
});

// turn schema into a model

export default mongoose.model("Product", ProductSchema);
