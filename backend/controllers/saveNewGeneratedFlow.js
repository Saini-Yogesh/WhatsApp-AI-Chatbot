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
        // Generate formatted nodes and edges
        // console.log("Calling getFormattedNodes...");
        const result = await getFormattedNodes(businessName, businessType);
        // console.log("Received from getFormattedNodes:", result);

        const { nodes, edges } = result;
        const flowText = await generateFlowText(nodes, edges);

        if (!nodes.length || !edges.length) {
            throw new Error("Generated flow is empty. Check API response.");
        }

        // Save/update the flow in the database
        const updatedFlow = await Flow.findByIdAndUpdate(
            flowId,
            { nodes, edges, flowText },
            { new: true, upsert: true } // Create if it doesn't exist
        );

        // console.log("✅ Flow saved successfully:", updatedFlow);
        return updatedFlow;
    } catch (error) {
        console.error("❌ Error saving generated flow:", error.message);
        return null;
    }
}

module.exports = saveNewGeneratedFlow;
