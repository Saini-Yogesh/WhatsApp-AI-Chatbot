// ngrok http 7000
const express = require("express");
const connectToMongoDB = require("./connect");
const cors = require("cors");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGO_URI = process.env.MONGO_URI;
// Connect to MongoDB
connectToMongoDB(MONGO_URI).then(() => {
  console.log("MongoDB Connected!"); // Once the connection to MongoDB is successful, log this message
});

// Routes
const userRoutes = require("./routes/userRoutes");
const flowRoutes = require("./routes/flowRoutes");
const webhookRoutes = require("./routes/webhookRoute");

app.use("/api/users", userRoutes);
app.use("/api/flows", flowRoutes);
app.use("/webhook", webhookRoutes);

// Start server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));