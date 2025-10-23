import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
  Universities: { type: String, required: true, unique: true },
  State: { type: String, required: true },
});

// Optional: add index to avoid case-sensitive duplicates
collegeSchema.index({ Universities: 1 }, { unique: true });

export default mongoose.model("College", collegeSchema);
