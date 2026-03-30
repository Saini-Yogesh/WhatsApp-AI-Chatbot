const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

/**
 * Generates a structured question flow using Gemini API.
 * @param {string} businessName - Name of the business.
 * @param {string} businessType - Type of business.
 * @returns {Promise<Object>} - Generated question flow.
 */
async function generateQuestionFlow(businessName, businessType) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Error: Missing GEMINI_API_KEY in environment variables.");
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `Generate a structured question flow for a WhatsApp AI Form Builder based on the following details:
        - Business Name: ${businessName}
        - Business Type: ${businessType}

        Create an interactive question-response flow where each question has 
        fixed responses leading to either an existing node or a new node while
        maintaining a logical sequence. The flow should form a closed loop, 
        ensuring the user eventually returns to the starting point. 
        The total number of nodes MUST be exactly 10, labeled 
        sequentially as node_1, node_2, node_3, and so on up to node_10. The user always 
        starts at node_1, which begins with a "Hello" message.
        The interaction follows a structured format where the user 
        inputs a response, and the system then provides the corresponding
        response and presents the next question.

        Respond explicitly with a valid JSON object matching this schema exactly:
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
            "edges": []
        }`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text().trim();
    
    // Safety check for markdown wrapping
    const jsonText = textResponse.replace(/```json|```/g, "").trim(); 
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating question flow:", error.message);
    return null;
  }
}

async function getFormattedNodes(businessName, businessType) {
  const rawNodes = await generateQuestionFlow(businessName, businessType);

  if (!rawNodes || !rawNodes.nodes) {
    console.error("Error: Failed to generate nodes.");
    return { nodes: [], edges: [] };
  }

  // ✅ Format nodes using a deterministic cleanly spaced Grid layout
  const columns = 3;
  const paddingX = 350; // Keeps nodes horizontally spaced well
  const paddingY = 280; // Keeps vertical spacing clear for edges

  const formattedNodes = rawNodes.nodes.map((node, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    const xPos = col * paddingX + (row % 2 === 1 ? 150 : 0); // Stagger every other row
    const yPos = row * paddingY;

    return {
      id: node.id,
      type: "custom",
      position: { x: xPos, y: yPos },
      data: {
        id: `node_${node.id}`,
        label: node.question,
        responses: node.PossibleresponsesForThisQuestion ? Object.keys(node.PossibleresponsesForThisQuestion) : [],
      },
      width: 243,
      height: 217,
      selected: false,
      positionAbsolute: { x: xPos, y: yPos },
      dragging: false,
    };
  });

  // ✅ Format edges
  const formattedEdges = rawNodes.nodes.flatMap((node) => {
    if (!node.PossibleresponsesForThisQuestion) return [];
    
    return Object.entries(node.PossibleresponsesForThisQuestion).map(
      ([response, targetNodeId], index) => ({
        source: node.id,
        sourceHandle: `response-${index}`,
        target: targetNodeId,
        targetHandle: null,
        label: response,
        id: `reactflow__edge-${node.id}response-${index}-${targetNodeId}`,
      })
    )
  });

  return { nodes: formattedNodes, edges: formattedEdges };
}

module.exports = getFormattedNodes;
