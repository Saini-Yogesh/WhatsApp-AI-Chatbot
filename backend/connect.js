const mongoose = require("mongoose"); // Import the mongoose library to interact with MongoDB

// Define an asynchronous function that connects to MongoDB using the provided URL
async function connectToMongoDB(url) {
  // Attempt to connect to the MongoDB database using mongoose's connect method
  return mongoose.connect(url); // The connect method returns a promise, so we await its resolution
}

module.exports = connectToMongoDB; // Export the connectToMongoDB function so it can be used in other files
