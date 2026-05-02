import mongoose from "mongoose";

const invitedGroupSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  groupName: {
    type: String,
  },
  invitedAt: {
    type: Date,
    default: Date.now,
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  invitedGroups: [invitedGroupSchema],
});

export const User = mongoose.model("User", userSchema);