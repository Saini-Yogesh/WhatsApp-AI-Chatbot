const User = require("../models/user");
const mongoose = require("mongoose");
const { generateAIResponses } = require("../services/geminiService");

async function registerBusiness(req, res) {
  try {
    const { businessName, businessDescription, email } = req.body;

    if (!businessName || !businessDescription) {
      return res.status(400).json({
        success: false,
        message: "Business name and description are required"
      });
    }

    // Generate AI-powered FAQs - but continue even if this fails
    console.log(`Generating AI responses for ${businessName}`);
    let aiResponses = [];
    try {
      aiResponses = await generateAIResponses(businessName, businessDescription);
      console.log(`Generated ${aiResponses.length} AI responses`);
    } catch (aiError) {
      console.error("AI generation error:", aiError.message);
      // Continue with empty AI responses
    }

    // Generate a random email if not provided
    const userEmail = email || `user_${Date.now()}@example.com`;

    // Save to DB
    const newUser = new User({
      businessName,
      businessDescription,
      email: userEmail,
      aiResponses,
    });

    await newUser.save();
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("Registration error:", error.message, error.stack);

    // Provide more specific error messages
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry error. This business may already be registered.",
        field: Object.keys(error.keyPattern)[0]
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
}
async function updateBusiness(req, res) {
  try {
    const { id } = req.params;
    const { businessName, businessDescription, regenerateResponses } = req.body;

    // Make sure the ID is valid and doesn't contain any colons
    const cleanId = id.replace(/^:/, ''); // Remove leading colon if present

    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    // Find the business by ID
    const business = await User.findById(cleanId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    // Update fields if provided
    if (businessName) business.businessName = businessName;
    if (businessDescription) business.businessDescription = businessDescription;

    // Regenerate AI responses if requested
    if (regenerateResponses && (businessName || businessDescription)) {
      try {
        console.log(`Regenerating AI responses for ${business.businessName}`);
        const aiResponses = await generateAIResponses(
          business.businessName,
          business.businessDescription
        );

        if (aiResponses.length > 0) {
          business.aiResponses = aiResponses;
          console.log(`Generated ${aiResponses.length} new AI responses`);
        }
      } catch (aiError) {
        console.error("AI regeneration error:", aiError.message);
        // Continue without updating AI responses
      }
    }

    // Save the updated business
    await business.save();

    res.status(200).json({
      success: true,
      message: "Business updated successfully",
      user: business
    });
  } catch (error) {
    console.error("Update error:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message
    });
  }
}

async function getAllBusinesses(req, res) {
  try {
    const businesses = await User.find({});
    res.status(200).json({
      success: true,
      count: businesses.length,
      users: businesses
    });
  } catch (error) {
    console.error("Fetch error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch businesses",
      error: error.message
    });
  }
}

module.exports = { registerBusiness, updateBusiness, getAllBusinesses };