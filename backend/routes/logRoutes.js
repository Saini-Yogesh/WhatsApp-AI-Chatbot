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

// GET /api/logs/analytics - Get analytics dashboard data with date range filter
router.get("/analytics", async (req, res) => {
  try {
    const range = req.query.range || "7d";
    const now = new Date();
    
    // Set up standard comparison times
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const dayBeforeYesterdayStart = new Date(yesterdayStart);
    dayBeforeYesterdayStart.setDate(dayBeforeYesterdayStart.getDate() - 1);

    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - todayStart.getDay());
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const last24hStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Fetch baseline KPI count metrics
    const [
      todayCount,
      yesterdayCount,
      dayBeforeYesterdayCount,
      weekCount,
      lastWeekCount,
      monthCount,
      last24hCount,
      errorsTodayCount,
      errorsYesterdayCount,
      adminTodayCount,
      adminYesterdayCount
    ] = await Promise.all([
      Log.countDocuments({ timestamp: { $gte: todayStart } }),
      Log.countDocuments({ timestamp: { $gte: yesterdayStart, $lt: todayStart } }),
      Log.countDocuments({ timestamp: { $gte: dayBeforeYesterdayStart, $lt: yesterdayStart } }),
      Log.countDocuments({ timestamp: { $gte: weekStart } }),
      Log.countDocuments({ timestamp: { $gte: lastWeekStart, $lt: weekStart } }),
      Log.countDocuments({ timestamp: { $gte: monthStart } }),
      Log.countDocuments({ timestamp: { $gte: last24hStart } }),
      Log.countDocuments({ timestamp: { $gte: todayStart }, action: /ERROR/ }),
      Log.countDocuments({ timestamp: { $gte: yesterdayStart, $lt: todayStart }, action: /ERROR/ }),
      Log.countDocuments({ timestamp: { $gte: todayStart }, action: /^ADMIN/ }),
      Log.countDocuments({ timestamp: { $gte: yesterdayStart, $lt: todayStart }, action: /^ADMIN/ })
    ]);

    // Top active hour and event today
    const [topEventTodayResult, activeHourTodayResult] = await Promise.all([
      Log.aggregate([
        { $match: { timestamp: { $gte: todayStart } } },
        { $group: { _id: "$action", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]),
      Log.aggregate([
        { $match: { timestamp: { $gte: todayStart } } },
        { $project: { hour: { $hour: "$timestamp" } } },
        { $group: { _id: "$hour", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ])
    ]);

    const mostTriggeredEvent = topEventTodayResult[0] ? topEventTodayResult[0]._id : "N/A";
    let mostActiveHour = "N/A";
    if (activeHourTodayResult[0]) {
      const h = activeHourTodayResult[0]._id;
      const ampm = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 || 12;
      mostActiveHour = `${hour12}:00 ${ampm}`;
    }

    // Determine starting date for charts based on range parameter
    let chartStartDate = todayStart;
    let isHourly = false;

    if (range === "today") {
      chartStartDate = todayStart;
      isHourly = true;
    } else if (range === "yesterday") {
      chartStartDate = yesterdayStart;
      isHourly = true;
    } else if (range === "7d") {
      chartStartDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === "30d") {
      chartStartDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (range === "90d") {
      chartStartDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (req.query.startDate) {
      chartStartDate = new Date(req.query.startDate);
    }

    // End date boundary
    const chartEndDate = range === "yesterday" ? todayStart : now;

    // Fetch analytical aggregates over range
    const [
      rawOverTime,
      rawDistribution,
      topEventsAgg,
      topRoutesAgg,
      rawHeatmap,
      opsCounts,
      errorTypesAgg,
      adminTimeline
    ] = await Promise.all([
      // Events over time
      Log.aggregate([
        { $match: { timestamp: { $gte: chartStartDate, $lt: chartEndDate } } },
        {
          $group: {
            _id: isHourly 
              ? { $hour: "$timestamp" } 
              : { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            total: { $sum: 1 },
            actions: { $addToSet: "$action" }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      // Distribution of actions
      Log.aggregate([
        { $match: { timestamp: { $gte: chartStartDate, $lt: chartEndDate } } },
        { $group: { _id: "$action", count: { $sum: 1 } } }
      ]),
      // Top events frequency
      Log.aggregate([
        { $match: { timestamp: { $gte: chartStartDate, $lt: chartEndDate } } },
        { $group: { _id: "$action", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      // Top routes frequency
      Log.aggregate([
        { $match: { timestamp: { $gte: chartStartDate, $lt: chartEndDate } } },
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      // GitHub-style heatmap (day of week vs hour)
      Log.aggregate([
        { $match: { timestamp: { $gte: chartStartDate, $lt: chartEndDate } } },
        {
          $group: {
            _id: {
              day: { $dayOfWeek: "$timestamp" }, // 1 (Sunday) to 7 (Saturday)
              hour: { $hour: "$timestamp" }
            },
            count: { $sum: 1 }
          }
        }
      ]),
      // Chatbot operation categories
      Log.aggregate([
        { $match: { timestamp: { $gte: chartStartDate, $lt: chartEndDate } } },
        {
          $group: {
            _id: "$action",
            count: { $sum: 1 }
          }
        }
      ]),
      // Errors by type
      Log.aggregate([
        { $match: { timestamp: { $gte: chartStartDate, $lt: chartEndDate }, action: /ERROR/ } },
        { $group: { _id: "$action", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      // Recent Admin Action Timeline
      Log.find({ action: /ADMIN/ })
        .sort({ timestamp: -1 })
        .limit(10)
    ]);

    // Format Events Over Time and fill gaps
    const overTime = [];
    if (isHourly) {
      // For hourly view (today/yesterday), pre-fill all 24 hours
      const hourCounts = new Array(24).fill(0).map((_, i) => ({ label: `${i}:00`, total: 0, unique: 0 }));
      rawOverTime.forEach(item => {
        if (item._id >= 0 && item._id < 24) {
          hourCounts[item._id].total = item.total;
          hourCounts[item._id].unique = item.actions.length;
        }
      });
      overTime.push(...hourCounts);
    } else {
      // For multi-day view, pre-fill all dates
      const dayMap = {};
      let tempDate = new Date(chartStartDate);
      while (tempDate <= chartEndDate) {
        const dateStr = tempDate.toISOString().slice(0, 10);
        dayMap[dateStr] = { label: tempDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }), total: 0, unique: 0 };
        tempDate.setDate(tempDate.getDate() + 1);
      }
      rawOverTime.forEach(item => {
        if (dayMap[item._id]) {
          dayMap[item._id].total = item.total;
          dayMap[item._id].unique = item.actions.length;
        }
      });
      overTime.push(...Object.values(dayMap));
    }

    // Format Category Distributions
    const categories = {
      "Flow Builder": 0,
      "Business Info": 0,
      "Access & View": 0,
      "System Errors": 0,
      "Others": 0
    };
    rawDistribution.forEach(item => {
      const act = item._id;
      if (act.includes("ERROR")) {
        categories["System Errors"] += item.count;
      } else if (act.startsWith("ADD_") || act.startsWith("DELETE_") || act.startsWith("CONNECT_") || act.startsWith("UPDATE_NODE") || act.includes("FLOW_SUCCESS")) {
        categories["Flow Builder"] += item.count;
      } else if (act.includes("BUSINESS_DETAILS")) {
        categories["Business Info"] += item.count;
      } else if (act.includes("ACCESSED")) {
        categories["Access & View"] += item.count;
      } else {
        categories["Others"] += item.count;
      }
    });
    const distribution = Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);

    // Format Heatmap Data (convert 1-indexed days to 0-6 index)
    // Days array: Mon, Tue, Wed, Thu, Fri, Sat, Sun
    const daysName = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const heatmap = [];
    // Initialize empty grid
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        heatmap.push({ day: daysName[d], hour: h, count: 0 });
      }
    }
    rawHeatmap.forEach(item => {
      // MongoDB $dayOfWeek is Sunday=1, Monday=2 ... Saturday=7
      // Map to index 0-6 for Mon-Sun:
      // Mon (2) -> 0, Tue (3) -> 1 ... Sat (7) -> 5, Sun (1) -> 6
      const mongoDay = item._id.day;
      const dayIdx = mongoDay === 1 ? 6 : mongoDay - 2;
      const hourIdx = item._id.hour;
      if (dayIdx >= 0 && dayIdx < 7 && hourIdx >= 0 && hourIdx < 24) {
        const cell = heatmap.find(c => c.day === daysName[dayIdx] && c.hour === hourIdx);
        if (cell) cell.count = item.count;
      }
    });

    // Format Chatbot Operation Metrics
    const operations = {
      nodesAdded: 0,
      nodesDeleted: 0,
      nodesUpdated: 0,
      nodesConnected: 0,
      flowsSaved: 0,
      flowErrors: 0,
      detailsFetched: 0,
      detailsUpdated: 0
    };
    opsCounts.forEach(item => {
      const act = item._id;
      if (act === "ADD_QUESTION_NODE") operations.nodesAdded += item.count;
      else if (act === "DELETE_QUESTION_NODE") operations.nodesDeleted += item.count;
      else if (act === "UPDATE_NODE_LABEL" || act === "UPDATE_NODE_RESPONSE") operations.nodesUpdated += item.count;
      else if (act === "CONNECT_NODES") operations.nodesConnected += item.count;
      else if (act === "SAVE_FLOW_SUCCESS") operations.flowsSaved += item.count;
      else if (act === "SAVE_FLOW_ERROR" || act === "FETCH_FLOW_ERROR") operations.flowErrors += item.count;
      else if (act === "FETCH_BUSINESS_DETAILS_SUCCESS") operations.detailsFetched += item.count;
      else if (act === "UPDATE_BUSINESS_DETAILS") operations.detailsUpdated += item.count;
    });

    // Error Center statistics
    const totalEventsRange = rawDistribution.reduce((acc, curr) => acc + curr.count, 0);
    const totalErrorsRange = rawDistribution.filter(d => d._id.includes("ERROR")).reduce((acc, curr) => acc + curr.count, 0);
    const errorRate = totalEventsRange > 0 ? parseFloat(((totalErrorsRange / totalEventsRange) * 100).toFixed(2)) : 0;

    // Build timeline chart of error counts over range
    const errorSpikes = overTime.map(d => {
      // Find matching index/label in rawOverTime but filter for errors
      const match = rawOverTime.find(item => {
        if (isHourly) {
          return `${item._id}:00` === d.label;
        } else {
          // Compare dates
          return item._id === d.label;
        }
      });
      return {
        label: d.label,
        count: 0 // Will populate if errors aggregated over time is added
      };
    });

    res.json({
      success: true,
      kpis: {
        totalEventsToday: {
          value: todayCount,
          priorValue: yesterdayCount
        },
        totalEventsYesterday: {
          value: yesterdayCount,
          priorValue: dayBeforeYesterdayCount
        },
        totalEventsThisWeek: {
          value: weekCount,
          priorValue: lastWeekCount
        },
        totalEventsThisMonth: {
          value: monthCount
        },
        eventsLast24h: {
          value: last24hCount
        },
        mostActiveHour,
        mostTriggeredEvent,
        errorsToday: {
          value: errorsTodayCount,
          priorValue: errorsYesterdayCount
        },
        adminActionsToday: {
          value: adminTodayCount,
          priorValue: adminYesterdayCount
        }
      },
      overTime,
      distribution,
      topEvents: topEventsAgg.map(op => ({ action: op._id, count: op.count })),
      topRoutes: topRoutesAgg.map(op => ({ route: op._id, visits: op.count })),
      heatmap,
      operations,
      adminTimeline: adminTimeline.map(op => ({
        timestamp: op.timestamp,
        action: op.action,
        path: op.path
      })),
      errorCenter: {
        totalToday: errorsTodayCount,
        totalWeek: rawDistribution.filter(d => d._id.includes("ERROR")).reduce((acc, curr) => acc + curr.count, 0),
        rate: errorRate,
        types: errorTypesAgg.map(err => ({ type: err._id, count: err.count }))
      }
    });
  } catch (error) {
    console.error("Error generating analytics dashboard:", error);
    res.status(500).json({ success: false, error: "Failed to generate analytics data" });
  }
});

// GET /api/logs - Retrieve logs with keyword searching, exact actions/paths filters, and pagination
router.get("/", async (req, res) => {
  try {
    const { search, action, path: filterPath, startDate, endDate, page = 1, limit = 50 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { action: { $regex: search, $options: "i" } },
        { path: { $regex: search, $options: "i" } }
      ];
    }

    if (action) {
      query.action = action;
    }

    if (filterPath) {
      query.path = filterPath;
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [logs, totalLogs, distinctActions, distinctPaths] = await Promise.all([
      Log.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limitNum),
      Log.countDocuments(query),
      Log.distinct("action"),
      Log.distinct("path")
    ]);

    res.json({
      success: true,
      logs,
      totalPages: Math.ceil(totalLogs / limitNum),
      currentPage: pageNum,
      totalCount: totalLogs,
      distinctActions,
      distinctPaths
    });
  } catch (error) {
    console.error("Error fetching logs list:", error);
    res.status(500).json({ success: false, error: "Failed to fetch logs list" });
  }
});

module.exports = router;
