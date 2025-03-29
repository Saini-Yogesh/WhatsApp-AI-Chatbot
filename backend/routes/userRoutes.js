const express = require("express");
const {
  registerBusiness,
  updateBusiness,
  getAllBusinesses,
  getAiResponses,
} = require("../controllers/userController");

const router = express.Router();

// Register a new business
router.post("/register", registerBusiness);

// Fetch AI responses by business ID
router.get("/:id", getAiResponses);

// Update business details
router.put("/update/:id", updateBusiness);

// Get all businesses
router.get("/", getAllBusinesses);

module.exports = router;
