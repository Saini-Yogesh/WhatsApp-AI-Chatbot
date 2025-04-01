const mongoose = require("mongoose");

const FlowSchema = new mongoose.Schema({
    nodes: { type: Array, required: true },
    edges: { type: Array, required: true },
    flowText: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Flow", FlowSchema);
