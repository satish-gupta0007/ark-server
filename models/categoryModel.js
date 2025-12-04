import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: {
        type: String,
        required: true,
    },
    categoryImage: {
        type: String
    },
    isActive: {
        type: Number
    },
  isDeleted:{type: Number, default: 0},
  lastUpdateBy:{ type: String, default: null },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export const Category = mongoose.model("Category", categorySchema);