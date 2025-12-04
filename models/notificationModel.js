import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  name: String,
  date:Date,
  notificationDesc:{ type: String, default: null },
  isDeleted:{type: Number, default: 0},
  isActive:{type: Boolean, default: false},
  collegeName:{type: String, default: null},
  lastUpdateBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null
      },
   createdByRole: {
          type: String,
         default: null
      },
       createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
      },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export const Notification = mongoose.model("Notification", notificationSchema);