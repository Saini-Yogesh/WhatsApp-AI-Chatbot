const { MongoClient, ObjectId } = require("mongodb");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
const dbName = "helloo";
const collectionName = "flows";
const userStateCollection = "user_state";
const flowDocumentId = process.env.FLOW_ID;

let db;

async function connectDB() {
    try {
        if (!db) {
            const client = new MongoClient(mongoURI);
            await client.connect();
            db = client.db(dbName);
            console.log("✅ Connected to MongoDB");
        }
        return db;
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        throw new Error("Failed to connect to MongoDB.");
    }
}

async function getNextQuestion(sender, userResponse) {
    try {
        const database = await connectDB();

        // Fetch user state
        const userState = await database.collection(userStateCollection).findOne({ sender });

        // Fetch flow text from database
        const flow = await database.collection(collectionName).findOne(
            { _id: new ObjectId(flowDocumentId) },
            { projection: { flowText: 1, _id: 0 } }
        );

        // Ensure flowText exists
        if (!flow || !flow.flowText) {
            return { question: "Flow not found.", responses: [] };
        }

        const flowText = flow.flowText; // Normal text
        const prevQuestion = userState?.currentQuestion || "No previous question";
        // console.log(prevQuestion);
        // Use Gemini AI to generate the next response
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `You were asked: "${prevQuestion}". You replied: "${userResponse}".  
                        Flow context: "${flowText}".  

                        If your response is relevant to the flow, continue the conversation naturally.  
                        If not, reply: "That’s outside the flow. For specific queries, contact example@gmail.com."`;

        const result = await model.generateContent(prompt);

        const geminiResponse = result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I'm not sure how to respond. If you have any specific questions, contact us at example@gmail.com.";

        // **Update user state with the new question**
        await database.collection(userStateCollection).updateOne(
            { sender },
            { $set: { currentQuestion: geminiResponse } },
            { upsert: true }
        );

        return { question: geminiResponse, responses: [] };
    } catch (error) {
        console.error("❌ Error processing flow:", error);
        return { question: "Error occurred.", responses: [] };
    }
}

module.exports = getNextQuestion;
