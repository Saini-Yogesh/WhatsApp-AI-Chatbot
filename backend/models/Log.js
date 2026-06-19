const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  user: {
    type: String,
    default: "Anonymous",
  },
  path: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Indexing for efficient retrieval sorted by timestamp
logSchema.index({ timestamp: -1 });

module.exports = mongoose.model("Log", logSchema);
