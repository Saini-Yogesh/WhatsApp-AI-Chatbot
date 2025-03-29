const User = require("../models/user");
const mongoose = require("mongoose");
const { generateAIResponses } = require("../services/geminiService");

// Register a business or update a bussinious
async function registerBusiness(req, res) {
  try {
    const { id, businessName, businessDescription, email } = req.body;

    if (!businessName || !businessDescription) {
      return res.status(400).json({ success: false, message: "Business name and description are required" });
    }

    // console.log(`Generating AI responses for ${businessName}`);
    let aiResponses = [];
    try {
      aiResponses = await generateAIResponses(businessName, businessDescription);
    } catch (aiError) {
      console.error("AI generation error:", aiError.message);
    }

    const userEmail = email || `user_${Date.now()}@example.com`;

    if (id) {
      // If an ID exists, update the document
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { businessName, businessDescription, email: userEmail, aiResponses },
        { new: true } // Return updated document
      );

      if (!updatedUser) return res.status(404).json({ success: false, message: "Business not found" });

      return res.status(200).json({ success: true, message: "Business updated", id: updatedUser._id });
    } else {
      // No ID provided, create a new document
      const newUser = new User({
        businessName,
        businessDescription,
        email: userEmail,
        aiResponses,
      });

      await newUser.save();
      return res.status(201).json({ success: true, message: "Business registered", id: newUser._id });
    }
  } catch (error) {
    console.error("Registration error:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate entry error. Business already registered." });
    }

    res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
}


// Fetch getBusiness by business ID
async function getBusiness(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }

    const user = await User.findById(id); // Fetch full details
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching business details:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch business details" });
  }
}


module.exports = { registerBusiness, getBusiness };
