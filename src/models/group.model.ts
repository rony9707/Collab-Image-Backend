import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: {
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