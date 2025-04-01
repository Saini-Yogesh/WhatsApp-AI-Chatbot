const fetch = require("node-fetch");
const { ObjectId } = require("mongodb");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Ensure this is set in your environment variables
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`;

async function getNextQuestion(db, collectionName, flowDocumentId, userId, userResponse) {
    try {
        const flow = await db.collection(collectionName).findOne(
            { _id: new ObjectId(flowDocumentId) },
            { projection: { flowText: 1, _id: 0 } }
        );

        const flowText = flow?.flowText || null;
        if (!flowText) {
            return { question: "Error: No flow data found.", responses: [] };
        }

        // Extract stored user responses
        const lines = flowText.split("\n").map(line => line.trim()).filter(line => line);
        let storedResponses = [];

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith("User: ")) {
                storedResponses.push(lines[i].replace("User: ", "").trim());
            }
        }

        if (storedResponses.length === 0) {
            return { question: "No stored responses found.", responses: [] };
        }

        // Call Gemini API to find the most relevant stored response
        const geminiPrompt = `
        I have the following stored responses: ${JSON.stringify(storedResponses)}.
        The user said: "${userResponse}".
        Which stored response is the most relevant to the user's input?
        Return only the exact stored response from the list without explanation.
        `;

        const payload = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: geminiPrompt }],
                },
            ],
        };

        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        const bestMatch = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;

        if (!bestMatch) {
            return { question: "I didn't understand that. Can you clarify?", responses: [] };
        }

        // Find the corresponding chatbot response
        let nextQuestion = null;
        let responses = [];

        for (let i = 0; i < lines.length; i++) {
            if (lines[i] === `User: ${bestMatch}`) {
                for (let j = i + 1; j < lines.length; j++) {
                    if (lines[j].startsWith("Chatbot:")) {
                        nextQuestion = lines[j].replace("Chatbot: ", "").trim();
                    } else if (lines[j].startsWith("(Options:")) {
                        responses = lines[j]
                            .replace("(Options:", "")
                            .replace(")", "")
                            .split(",")
                            .map(opt => opt.trim());
                        break;
                    }
                }
                break;
            }
        }

        if (!nextQuestion) {
            return { question: "I couldn't find a relevant response. Please try again.", responses: [] };
        }

        return { question: nextQuestion, responses };
    } catch (error) {
        console.error("❌ Error processing flow:", error);
        return { question: "Error occurred.", responses: [] };
    }
}

module.exports = getNextQuestion;
