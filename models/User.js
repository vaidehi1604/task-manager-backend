import mongoose from "mongoose";
import { ROLE } from "../config/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    roles: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.USER,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
