const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

/**
 * Generates a natural language flow text based on given nodes and edges.
 * @param {Array} nodes - List of nodes with questions and responses.
 * @param {Array} edges - List of edges connecting nodes.
 * @returns {Promise<string>} - Generated conversational flow text.
 */
async function generateFlowText(nodes, edges) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Error: Missing GEMINI_API_KEY in environment variables.");
        return "";
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let flowStructure = "Here is a structured flow:\n\n";
        nodes.forEach((node) => {
            flowStructure += `Node ${node.id}: ${node.data.label}\n`;
            flowStructure += `Responses:\n`;
            edges
                .filter((edge) => edge.source === node.id)
                .forEach((edge) => {
                    flowStructure += `  - "${edge.label}" → Leads to Node ${edge.target}\n`;
                });
            flowStructure += `\n`;
        });

        const prompt = `Convert the following structured flow into a smooth and conversational chatbot script:
        
        ${flowStructure}

        The output should be a natural conversation flow, guiding the user step by step.
        Format the output as a structured conversation text, avoiding technical jargon.
        Use a friendly and engaging tone. Text ONLY.`;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error("Error generating flow text:", error.message);
        return "";
    }
}

// ✅ Export the function
module.exports = generateFlowText;
