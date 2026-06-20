const express = require("express");
const router = express.Router();
const Log = require("../models/Log");

// POST /api/logs - Create a new log
router.post("/", async (req, res) => {
  try {
    const { action, path } = req.body;
    const newLog = new Log({ action, path });
    await newLog.save();
    res.status(201).json({ success: true, message: "Log saved" });
  } catch (error) {
    console.error("Error saving log:", error);
    res.status(500).json({ success: false, error: "Failed to save log" });
  }
});

// POST /api/logs/verify-admin - Simple hardcoded password check
router.post("/verify-admin", (req, res) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = "122217"; // Hardcoded password

  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: "Incorrect password" });
  }
});

// GET /api/logs/analytics - Get analytics dashboard data
router.get("/analytics", async (req, res) => {
  try {
    const now = new Date();
    const todayMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const yesterdayMidnight = new Date(todayMidnight);
    yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);

    const [todayCount, yesterdayCount, topOperations] = await Promise.all([
      Log.countDocuments({ timestamp: { $gte: todayMidnight } }),
      Log.countDocuments({
        timestamp: { $gte: yesterdayMidnight, $lt: todayMidnight },
      }),
      Log.aggregate([
        {
          $group: {
            _id: { action: "$action", path: "$path" },
            totalCount: { $sum: 1 },
            todayCount: {
              $sum: {
                $cond: [{ $gte: ["$timestamp", todayMidnight] }, 1, 0],
              },
            },
          },
        },
        { $sort: { totalCount: -1 } },
      ]),
    ]);

    res.json({
      success: true,
      todayCount,
      yesterdayCount,
      topOperations: topOperations.map((op) => ({
        action: op._id.action,
        path: op._id.path,
        totalCount: op.totalCount,
        todayCount: op.todayCount,
      })),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch analytics" });
  }
});

// GET /api/logs - Retrieve logs with pagination for efficiency
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const logs = await Log.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const totalLogs = await Log.countDocuments();

    res.json({
      success: true,
      logs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ success: false, error: "Failed to fetch logs" });
  }
});

module.exports = router;
