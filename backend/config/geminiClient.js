const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("❌ Missing GEMINI_API_KEY in environment variables.");
}

const geminiClient = axios.create({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/models",
  headers: { "Content-Type": "application/json" },
});

module.exports = { geminiClient, GEMINI_API_KEY }; 
