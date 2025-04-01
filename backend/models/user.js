const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true },
    businessDescription: { type: String, required: true },
    aiResponses: { type: Array, default: [] }, // Store as an array of Q&A
  },
  { timestamps: true }
);

// Create a sparse unique index that only applies to non-null values
userSchema.index({ email: 1 }, { unique: true, sparse: true });

const User = mongoose.model("User", userSchema);

module.exports = User;