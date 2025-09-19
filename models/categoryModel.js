import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: String,
  level: { type: Number, default: 0 },
  parentId: { type: String, default: null },
  isActive:{ type: Boolean, default: null },
  categoryImage:{ type: String, default: null },
  componentType:{ type: String, default: null },
  addedBy:{ type: String, default: null },
  categoryBrief:{ type: String, default: null },
  categoryDesc:{ type: String, default: null },
  lastUpdateBy:{ type: String, default: null },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export const Category = mongoose.model("Category", categorySchema);