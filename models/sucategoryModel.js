import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
  subCategoryName: {
        type: String,
        required: true,
    },
    subCategoryImage: {
        type: String,
        default:null
    },
    categoryId: {
         type: mongoose.Schema.Types.ObjectId,
        required: true,
       ref: "Category",
    },
    isActive: {
        type: Number
    },
  isDeleted:{type: Number, default: 0},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export const SubCategory = mongoose.model("sub-category", subcategorySchema);