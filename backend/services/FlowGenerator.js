/**
 * Generates a structured question flow using Gemini API.
 * @param {string} businessName - Name of the business.
 * @param {string} businessType - Type of business.
 * @returns {Promise<Object>} - Generated question flow.
*/
const apiKey = process.env.GEMINI_API_KEY; // Ensure this is set in your environment variables
async function generateQuestionFlow(businessName, businessType) {
    if (!apiKey) {
        console.error("Error: Missing REACT_APP_GEMINI_API_KEY in environment variables.");
        return null;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `Generate a structured question flow for a WhatsApp AI Form Builder based on the following details:
                        - Business Name: ${businessName}
                        - Business Type: ${businessType}

                        Create an interactive question-response flow where each question has 
                        fixed responses leading to either an existing node or a new node while
                        maintaining a logical sequence. The flow should form a closed loop, 
                        ensuring the user eventually returns to the starting point. 
                        The total number of nodes should be between 10 and 25, labeled 
                        sequentially as node_1, node_2, node_3, and so on. The user always 
                        starts at node_1, which begins with a "Hello" message.
                        The interaction follows a structured format where the user 
                        inputs a response, and the system then provides the corresponding
                        response and presents the next question. The design should ensure
                        smooth transitions, avoiding dead ends while keeping the 
                        conversation engaging and cohesive.

                        The user starts by entering any text like hello, which acts as
                        the entry point. The system then asks whether the user wants a
                        room or something else. This question directs the user into the 
                        flow based on their response.

                        Format the response as valid JSON:
                        {
                            "nodes": [
                                {
                                    "id": "unique_id_1",
                                    "question": "First question?",
                                    "PossibleresponsesForThisQuestion": {
                                        "yes": "unique_id_2",
                                        "no": "unique_id_3",
                                        "other": "unique_id_4"
                                    }
                                }
                            ],
                            "edges": [
                                { "from": "unique_id_1", 
                                  "response": "yes", 
                                  "to": "unique_id_2" 
                                }
                        }`
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

        const textResponse = data.candidates[0].content.parts[0].text.trim();
        const jsonText = textResponse.replace(/```json|```/g, "").trim(); // Remove markdown code block if present
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating question flow:", error.message);
        return null;
    }
}

async function getFormattedNodes(businessName, businessType) {
    const rawNodes = await generateQuestionFlow(businessName, businessType);

    // console.log(rawNodes);
    if (!rawNodes) {
        console.error("Error: Failed to generate nodes.");
        return { nodes: [], edges: [] };
    }

    // ✅ Format nodes
    const formattedNodes = rawNodes.nodes.map((node, index) => ({
        id: node.id,
        type: "custom",
        position: { x: Math.random() * 400, y: index * 200 }, // Randomized position
        data: {
            id: `node_${node.id}`,
            label: node.question, // Store the exact question
            responses: Object.keys(node.PossibleresponsesForThisQuestion) // ✅ Actual responses (keys)
        },
        width: 243,
        height: 217,
        selected: false,
        positionAbsolute: { x: Math.random() * 400, y: index * 200 },
        dragging: false
    }));

    // ✅ Format edges
    const formattedEdges = rawNodes.nodes.flatMap((node) =>
        Object.entries(node.PossibleresponsesForThisQuestion).map(([response, targetNodeId], index) => ({
            source: node.id, // Current node
            sourceHandle: `response-${index}`, // Handle for connection
            target: targetNodeId, // Target node
            targetHandle: null, // No specific handle needed
            label: response, // Show response as edge label
            id: `reactflow__edge-${node.id}response-${index}-${targetNodeId}`
        }))
    );

    return { nodes: formattedNodes, edges: formattedEdges };
}

module.exports = getFormattedNodes;