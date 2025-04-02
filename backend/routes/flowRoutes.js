const express = require("express");
const Flow = require("../models/Flow");
const router = express.Router();
const mongoose = require("mongoose");
const generateFlowText = require("../services/FlowTextGenerator");

// Save or update flow
router.post("/save", async (req, res) => {
    try {
        const { id, nodes, edges } = req.body;

        // Generate flow text using FlowTextGenerator
        const flowText = await generateFlowText(nodes, edges);

        if (id) {
            // If an ID exists, update the document
            const updatedFlow = await Flow.findByIdAndUpdate(
                id,
                { nodes, edges, flowText },
                { new: true } // Return updated document
            );

            if (!updatedFlow) return res.status(404).json({ error: "Flow not found" });

            return res.status(200).json({ message: "Flow updated", id: updatedFlow._id });
        } else {
            // No ID provided, create a new document
            const newFlow = new Flow({ nodes, edges, flowText });
            await newFlow.save();

            return res.status(201).json({ message: "Flow created", id: newFlow._id });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Fetch the latest saved flow
router.get("/get/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract from req.params, NOT req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Flow ID" });
        }

        const flow = await Flow.findById(id);
        if (!flow) {
            return res.status(404).json({ message: "Flow not found" });
        }

        res.status(200).json(flow);
    } catch (err) {
        console.error("Error fetching flow:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
