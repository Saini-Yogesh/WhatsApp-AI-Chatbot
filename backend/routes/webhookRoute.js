const express = require("express");
const twilio = require("twilio");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const router = express.Router();

// Twilio Credentials
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

// console.log("TWILIO_SID:", process.env.TWILIO_SID);
// console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN);
// MongoDB Credentials
const mongoURI = process.env.MONGO_URI;
const dbName = "helloo"; // ✅ Change to "helloo"
const collectionName = "flows"; // ✅ Change to "flows"
const flowDocumentId = "67e8d648fbbeb112faf66791"; // ✅ ObjectId in MongoDB

let db;

// Connect to MongoDB
MongoClient.connect(mongoURI)
    .then(client => {
        db = client.db(dbName);
        console.log(`✅ Connected to MongoDB - Database: ${dbName}`);
    })
    .catch(error => console.error("❌ MongoDB connection error:", error));

async function getNextQuestion(userId, userResponse) {
    try {
        const flow = await db.collection(collectionName).findOne({ _id: new ObjectId(flowDocumentId) });

        if (!flow) {
            console.error("❌ Flow document not found.");
            return { question: "Flow document missing.", responses: [] };
        }

        const userState = await db.collection("user_states").findOne({ userId });
        let currentNodeId = userState?.currentNodeId || "node_1";

        // console.log("✅ Current Node ID:", currentNodeId);

        const currentNode = flow.nodes.find(node => node.id === currentNodeId);
        if (!currentNode) return { question: "Invalid node.", responses: [] };

        // console.log("✅ Current Node Data:", currentNode);

        const responseIndex = currentNode.data.responses.indexOf(userResponse);
        if (responseIndex === -1) {
            console.warn("❌ Invalid Response:", userResponse);
            return { question: "Please choose a valid option.", responses: currentNode.data.responses };
        }

        // console.log("✅ Response Index:", responseIndex);

        const edge = flow.edges.find(e => e.source === currentNodeId && e.sourceHandle === `response-${responseIndex}`);
        if (!edge) {
            console.warn("❌ No Edge Found:", { currentNodeId, responseIndex });
            return { question: "No valid next step.", responses: [] };
        }

        const nextNodeId = edge.target;
        // console.log("✅ Next Node ID:", nextNodeId);

        const nextNode = flow.nodes.find(node => node.id === nextNodeId);
        if (!nextNode) {
            console.warn("❌ Next Node Not Found:", nextNodeId);
            return { question: "Flow ended.", responses: [] };
        }

        // console.log("✅ Next Node Data:", nextNode);

        await db.collection("user_states").updateOne(
            { userId },
            { $set: { currentNodeId: nextNodeId } },
            { upsert: true }
        );

        return { question: nextNode.data.label, responses: nextNode.data.responses };
    } catch (error) {
        console.error("❌ Error processing flow:", error);
        return { question: "Error occurred.", responses: [] };
    }
}

// Webhook to receive WhatsApp messages
router.post("/", async (req, res) => {
    const message = req.body.Body.trim();
    const sender = req.body.From;

    let response;
    try {
        response = await getNextQuestion(sender, message);
    } catch (error) {
        console.error("❌ Error processing flow:", error);
        response = { question: "Sorry, I encountered an issue.", responses: [] };
    }

    // Send WhatsApp Interactive Buttons
    if (response.responses.length > 0) {
        try {
            twilioClient.messages
                .create({
                    from: "whatsapp:+14155238886", // Twilio Sandbox Number
                    to: sender,
                    body: `${response.question}\n\nOptions: ${response.responses.join(", ")}`, // ✅ Send text with options
                })
                .then(message => console.log(`✅ Text Message Sent: ${message.sid}`))
                .catch(error => {
                    console.error("❌ Error sending text message:", error);
                });
        } catch (error) {
            console.error("❌ Critical Error (Skipping Twilio Message):", error);
        }
    }
    else {
        console.error("❌ No valid responses, skipping Twilio message.");
    }
    res.send({ reply: response.question, Responses: response.responses });
});

module.exports = router;