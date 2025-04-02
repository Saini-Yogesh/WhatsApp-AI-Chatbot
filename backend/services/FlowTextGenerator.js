const fetch = require("node-fetch"); // Ensure this package is installed
const apiKey = process.env.GEMINI_API_KEY; // Set your API key in environment variables

/**
 * Generates a natural language flow text based on given nodes and edges.
 * @param {Array} nodes - List of nodes with questions and responses.
 * @param {Array} edges - List of edges connecting nodes.
 * @returns {Promise<string>} - Generated conversational flow text.
 */
async function generateFlowText(nodes, edges) {
    if (!apiKey) {
        console.error("Error: Missing GEMINI_API_KEY in environment variables.");
        return null;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

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

    const payload = {
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `Convert the following structured flow into a smooth and conversational chatbot script:
                        
                        ${flowStructure}

                        The output should be a natural conversation flow, guiding the user step by step.
                        Format the output as a structured conversation text, avoiding technical jargon.
                        Use a friendly and engaging tone.`
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!data || !data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
            console.error("Error: Invalid API response", JSON.stringify(data, null, 2));
            return null;
        }
        // console.log(data.candidates[0].content.parts[0].text.trim());
        // const jsonText = textResponse.replace(/```json|```/g, "").trim(); // Remove markdown code block if present
        return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error("Error generating flow text:", error.message);
        return null;
    }
}

// ✅ Export the function
module.exports = generateFlowText;
