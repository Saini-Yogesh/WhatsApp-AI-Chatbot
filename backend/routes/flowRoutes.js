const express = require("express");
const Flow = require("../models/Flow");
const router = express.Router();
const mongoose = require("mongoose");
const generateFlowText = require("../services/FlowTextGenerator");

// Save or update flow -> Asynchronous processing for UI latency optimization
router.post("/save", async (req, res) => {
    try {
        const { id, nodes, edges } = req.body;

        let flowDoc;
        if (id) {
            // Find Existing Flow and replace Nodes/Edges
            flowDoc = await Flow.findByIdAndUpdate(
                id,
                { nodes, edges },
                { new: true, upsert: true } 
            );
        } else {
            // New Flow Instance
            flowDoc = new Flow({ nodes, edges, flowText: "Generating summary..." });
            await flowDoc.save();
        }

        // Return immediately with success so Frontend does not hang!
        res.status(id ? 200 : 201).json({ 
            message: id ? "Flow updated successfully" : "Flow created successfully", 
            id: flowDoc._id 
        });

        // Background ASYNC Task: Let Gemini AI convert the new map structure into FlowText
        generateFlowText(nodes, edges)
            .then(generatedText => {
                if (generatedText) {
                    Flow.findByIdAndUpdate(flowDoc._id, { flowText: generatedText }).exec()
                        .then(() => console.log(`✅ Background processing finished! Flow ID: ${flowDoc._id} updated with flow script.`))
                        .catch(err => console.error("❌ Failed to update flow text:", err));
                }
            })
            .catch(err => {
                console.error(`❌ Background processing failed for Flow ID: ${flowDoc._id}`, err);
            });

    } catch (err) {
        console.error("Save Route Error:", err);
        res.status(500).json({ error: "Failed to save flow." });
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
