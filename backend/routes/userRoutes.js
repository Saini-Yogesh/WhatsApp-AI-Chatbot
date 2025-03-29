const express = require("express");
const {
  registerBusiness,
  getBusiness,
} = require("../controllers/userController");

const router = express.Router();

// Register a new business
router.post("/register", registerBusiness);

// Fetch AI responses by business ID
router.get("/:id", getBusiness);

module.exports = router;
