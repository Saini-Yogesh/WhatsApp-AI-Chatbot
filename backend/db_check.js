const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI not found in env");
  process.exit(1);
}

mongoose.connect(MONGO_URI).then(async () => {
  console.log("Connected to MongoDB");
  const Log = require("./models/Log");
  
  // Find all logs
  const logs = await Log.find({}).limit(5);
  console.log("Sample logs:", JSON.stringify(logs, null, 2));

  // Count total logs
  const total = await Log.countDocuments({});
  console.log("Total logs count:", total);

  // Let's check if the collection still contains old details fields
  const rawLogs = await Log.find({}).lean().limit(5);
  console.log("Raw logs lean:", JSON.stringify(rawLogs, null, 2));

  mongoose.connection.close();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
