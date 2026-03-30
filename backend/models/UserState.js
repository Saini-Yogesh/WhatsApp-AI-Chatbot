const mongoose = require("mongoose");

const UserStateSchema = new mongoose.Schema({
    sender: { type: String, required: true, unique: true },
    currentQuestion: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("UserState", UserStateSchema);
