const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in env configuration!");
  process.exit(1);
}

const Log = require("./models/Log");

const EVENTS = [
  "HOME_PAGE_ACCESSED",
  "ADMIN_LOGS_ACCESSED",
  "FETCH_BUSINESS_DETAILS_SUCCESS",
  "FETCH_BUSINESS_DETAILS_ERROR",
  "UPDATE_BUSINESS_DETAILS",
  "ERROR_BUSINESS_DETAILS",
  "ADD_QUESTION_NODE",
  "UPDATE_NODE_LABEL",
  "UPDATE_NODE_RESPONSE",
  "DELETE_QUESTION_NODE",
  "CONNECT_NODES",
  "SAVE_FLOW_SUCCESS",
  "SAVE_FLOW_ERROR",
  "FETCH_FLOW_SUCCESS",
  "FETCH_FLOW_ERROR"
];

const PATHS = [
  "/",
  "/adminlogs",
  "/dashboard",
  "/flow-editor"
];

// Helper to generate a random date in the last N days
function getRandomDateInLastDays(days) {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * days * 24 * 60 * 60 * 1000);
  
  // Distribute hours to make heatmaps more interesting (peak around afternoon/evening)
  const hourChance = Math.random();
  let targetHour;
  if (hourChance < 0.15) {
    targetHour = Math.floor(Math.random() * 8); // Late night: 12am - 8am (low traffic)
  } else if (hourChance < 0.65) {
    targetHour = 9 + Math.floor(Math.random() * 8); // Working hours: 9am - 5pm (high traffic)
  } else {
    targetHour = 17 + Math.floor(Math.random() * 7); // Evening hours: 5pm - 12am (peak traffic)
  }
  pastDate.setHours(targetHour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
  return pastDate;
}

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB!");

    // Clear existing logs
    console.log("Clearing existing logs...");
    const deleteResult = await Log.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} old logs.`);

    const seedLogs = [];
    const numLogs = 350; // Generate 350 logs

    console.log(`Generating ${numLogs} realistic mock logs...`);
    for (let i = 0; i < numLogs; i++) {
      // Pick random event weighted towards accesses and canvas operations
      const eventChance = Math.random();
      let action = "HOME_PAGE_ACCESSED";
      let path = "/";

      if (eventChance < 0.35) {
        action = "HOME_PAGE_ACCESSED";
        path = "/";
      } else if (eventChance < 0.45) {
        action = "ADMIN_LOGS_ACCESSED";
        path = "/adminlogs";
      } else if (eventChance < 0.55) {
        action = "FETCH_BUSINESS_DETAILS_SUCCESS";
        path = "/";
      } else if (eventChance < 0.60) {
        action = "UPDATE_BUSINESS_DETAILS";
        path = "/";
      } else if (eventChance < 0.70) {
        action = "ADD_QUESTION_NODE";
        path = "/flow-editor";
      } else if (eventChance < 0.80) {
        action = "UPDATE_NODE_LABEL";
        path = "/flow-editor";
      } else if (eventChance < 0.88) {
        action = "CONNECT_NODES";
        path = "/flow-editor";
      } else if (eventChance < 0.92) {
        action = "SAVE_FLOW_SUCCESS";
        path = "/flow-editor";
      } else if (eventChance < 0.95) {
        action = "FETCH_FLOW_SUCCESS";
        path = "/flow-editor";
      } else if (eventChance < 0.97) {
        // Random error
        const errors = [
          "FETCH_BUSINESS_DETAILS_ERROR",
          "ERROR_BUSINESS_DETAILS",
          "SAVE_FLOW_ERROR",
          "FETCH_FLOW_ERROR"
        ];
        action = errors[Math.floor(Math.random() * errors.length)];
        path = action.startsWith("SAVE") || action.startsWith("FETCH_FLOW") ? "/flow-editor" : "/";
      } else {
        action = "DELETE_QUESTION_NODE";
        path = "/flow-editor";
      }

      seedLogs.push({
        action,
        path,
        timestamp: getRandomDateInLastDays(30) // Spread over 30 days
      });
    }

    // Insert to DB
    const insertResult = await Log.insertMany(seedLogs);
    console.log(`✅ Successfully seeded ${insertResult.length} logs!`);

    await mongoose.connection.close();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
