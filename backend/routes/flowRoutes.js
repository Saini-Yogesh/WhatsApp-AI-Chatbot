const express = require("express");
const Flow = require("../models/Flow");
const router = express.Router();

// Save or update flow
router.post("/save", async (req, res) => {
    try {
        const { id, nodes, edges } = req.body;

        if (id) {
            // If an ID exists, update the document
            const updatedFlow = await Flow.findByIdAndUpdate(
                id,
                { nodes, edges },
                { new: true } // Return updated document
            );

            if (!updatedFlow) return res.status(404).json({ error: "Flow not found" });

            return res.status(200).json({ message: "Flow updated", id: updatedFlow._id });
        } else {
            // No ID provided, create a new document
            const newFlow = new Flow({ nodes, edges });
            await newFlow.save();
            return res.status(201).json({ message: "Flow created", id: newFlow._id });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch the latest saved flow
router.get("/get", async (req, res) => {
    try {
        const flow = await Flow.findOne(); // Fetch any existing flow
        if (!flow) return res.status(404).json({ message: "No flow found" });

        res.status(200).json(flow);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
