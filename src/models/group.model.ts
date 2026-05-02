import mongoose from "mongoose";
import { describe } from "node:test";

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  access: [
    {
      type: String, // email only
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Group = mongoose.model("Group", groupSchema);
