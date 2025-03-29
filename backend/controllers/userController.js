const User = require("../models/user");
const mongoose = require("mongoose");
const { generateAIResponses } = require("../services/geminiService");

// Register a new business
async function registerBusiness(req, res) {
  try {
    const { businessName, businessDescription, email } = req.body;

    if (!businessName || !businessDescription) {
      return res.status(400).json({ success: false, message: "Business name and description are required" });
    }

    console.log(`Generating AI responses for ${businessName}`);
    let aiResponses = [];
    try {
      aiResponses = await generateAIResponses(businessName, businessDescription);
    } catch (aiError) {
      console.error("AI generation error:", aiError.message);
    }

    const userEmail = email || `user_${Date.now()}@example.com`;

    const newUser = new User({
      businessName,
      businessDescription,
      email: userEmail,
      aiResponses,
    });

    await newUser.save();
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("Registration error:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate entry error. Business already registered." });
    }

    res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
}

// Update business details
async function updateBusiness(req, res) {
  try {
    const { id } = req.params;
    const { businessName, businessDescription, regenerateResponses } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const business = await User.findById(id);
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    if (businessName) business.businessName = businessName;
    if (businessDescription) business.businessDescription = businessDescription;

    if (regenerateResponses && (businessName || businessDescription)) {
      try {
        console.log(`Regenerating AI responses for ${business.businessName}`);
        const aiResponses = await generateAIResponses(business.businessName, business.businessDescription);
        if (aiResponses.length > 0) {
          business.aiResponses = aiResponses;
        }
      } catch (aiError) {
        console.error("AI regeneration error:", aiError.message);
      }
    }

    await business.save();
    res.status(200).json({ success: true, message: "Business updated successfully", user: business });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
}

// Get all businesses
async function getAllBusinesses(req, res) {
  try {
    const businesses = await User.find({});
    res.status(200).json({ success: true, count: businesses.length, users: businesses });
  } catch (error) {
    console.error("Fetch error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch businesses", error: error.message });
  }
}

// Fetch AI responses by business ID
async function getAiResponses(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }

    const user = await User.findById(id, "aiResponses");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, aiResponses: user.aiResponses });
  } catch (error) {
    console.error("Error fetching AI responses:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch AI responses" });
  }
}

module.exports = { registerBusiness, updateBusiness, getAllBusinesses, getAiResponses };
