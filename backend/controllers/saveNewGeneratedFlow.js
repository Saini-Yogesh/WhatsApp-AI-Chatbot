const Flow = require("../models/Flow");
const getFormattedNodes = require("../services/FlowGenerator");
const generateFlowText = require("../services/FlowTextGenerator")

/**
 * Generates and saves a structured question flow in the database.
 * @param {string} flowId - Unique ID of the flow.
 * @param {string} businessName - Name of the business.
 * @param {string} businessType - Type of business.
 * @returns {Promise<Object>} - Saved flow document.
 */
async function saveNewGeneratedFlow(flowId, businessName, businessType) {
    try {
        // Generate formatted nodes and edges (this takes time so we MUST await it)
        const result = await getFormattedNodes(businessName, businessType);
        const { nodes, edges } = result;

        if (!nodes.length || !edges.length) {
            throw new Error("Generated flow is empty. Check API response.");
        }

        // Save the flow instantly so the frontend canvas can render on reload
        const updatedFlow = await Flow.findByIdAndUpdate(
            flowId,
            { nodes, edges, flowText: "Generating script in background..." },
            { new: true, upsert: true } // Create if it doesn't exist
        );

        // Async Background Task: generate script so we don't block the caller thread
        generateFlowText(nodes, edges)
            .then(text => {
                if (text) {
                    Flow.findByIdAndUpdate(flowId, { flowText: text }).exec();
                }
            })
            .catch(err => console.error("Flow Text Gen failed", err));

        return updatedFlow;
    } catch (error) {
        console.error("❌ Error saving generated flow:", error.message);
        return null;
    }
}

module.exports = saveNewGeneratedFlow;
