const Flow = require("../models/Flow");
const UserState = require("../models/UserState");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const flowDocumentId = process.env.FLOW_ID;

async function getNextQuestion(sender, userResponse) {
    try {
        // Fetch user state through Mongoose
        const userState = await UserState.findOne({ sender });

        // Fetch flow text from database through Mongoose directly
        const flow = await Flow.findById(flowDocumentId).select("flowText");

        if (!flow || !flow.flowText) {
            return { question: "Flow not found.", responses: [] };
        }

        const flowText = flow.flowText;
        const prevQuestion = userState?.currentQuestion || "No previous question";

        // Use Gemini AI to generate the next response
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `You were asked: "${prevQuestion}". You replied: "${userResponse}".  
                        Flow context: "${flowText}".  

                        If your response is relevant to the flow, continue the conversation naturally.  
                        If not, reply: "That’s outside the flow. For specific queries, contact example@gmail.com."`;

        const result = await model.generateContent(prompt);

        const geminiResponse = result.response?.text() || 
            "I'm not sure how to respond. If you have any specific questions, contact us at example@gmail.com.";

        // Update user state with the new question efficiently via Mongoose
        await UserState.findOneAndUpdate(
            { sender },
            { $set: { currentQuestion: geminiResponse } },
            { upsert: true, new: true }
        );

        return { question: geminiResponse, responses: [] };
    } catch (error) {
        console.error("❌ Error processing flow:", error);
        return { question: "Error occurred processing your response. Please try again.", responses: [] };
    }
}

module.exports = getNextQuestion;
