import mongoose from "mongoose";
import {
  TASK_STATUS,
  TASK_PRIORITY,
  TASK_CATEGORY,
} from "../config/constants.js";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.PENDING,
    },

    category: {
      type: String,
      enum: Object.values(TASK_CATEGORY),
      required: true,
    },

    priority: {
      type: String,
      enum: Object.values(TASK_PRIORITY),
      default: TASK_PRIORITY.MEDIUM,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Index
TaskSchema.index({ userId: 1, status: 1 });

export default mongoose.model("Task", TaskSchema);
