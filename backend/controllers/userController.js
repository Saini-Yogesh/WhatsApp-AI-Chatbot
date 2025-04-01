const User = require("../models/user");
const mongoose = require("mongoose");
const { generateAIResponses } = require("../services/geminiService");
const saveNewGeneratedFlow = require("./saveNewGeneratedFlow");

// Register a business or update a bussinious
async function registerBusiness(req, res) {
  try {
    const { flow_id, id, businessName, businessDescription } = req.body;

    if (!businessName || !businessDescription) {
      return res.status(400).json({ success: false, message: "Business name and description are required" });
    }

    // Generate AI responses
    let aiResponses = [];
    try {
      aiResponses = await generateAIResponses(businessName, businessDescription);
    } catch (aiError) {
      console.error("AI generation error:", aiError.message);
    }

    let user;
    if (id) {
      // Update existing business
      user = await User.findByIdAndUpdate(
        id,
        { businessName, businessDescription, aiResponses },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ success: false, message: "Business not found" });
      }
    } else {
      // Create new business
      user = new User({
        businessName,
        businessDescription,
        aiResponses,
      });
      await user.save();
    }

    // Generate flow (wait for completion)
    if (flow_id) {
      await saveNewGeneratedFlow(flow_id, businessName, businessDescription);
    }

    return res.status(id ? 200 : 201).json({
      success: true,
      message: id ? "Business updated successfully" : "Business registered successfully",
      user,
    });

  } catch (error) {
    console.error("Registration error:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate entry error. Business already registered." });
    }

    return res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
}

// Fetch Business by ID
async function getBusiness(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }

    const user = await User.findById(id);
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
