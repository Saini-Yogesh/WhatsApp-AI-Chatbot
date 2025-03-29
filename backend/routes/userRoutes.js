const express = require("express");
const { registerBusiness, updateBusiness, getAllBusinesses } = require("../controllers/userController");

const router = express.Router();

// Register new business
router.post("/register", registerBusiness);

// Update business by ID
router.put("/update/:id", updateBusiness);

// Get all businesses
router.get("/", getAllBusinesses);

module.exports = router;