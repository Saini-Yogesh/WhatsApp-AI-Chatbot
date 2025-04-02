const express = require("express");
const twilio = require("twilio");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const router = express.Router();

// Twilio Credentials
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

const getNextQuestion = require("../services/getNextQuestion");

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
    // if (response.responses.length > 0) {
    //     try {
    //         twilioClient.messages
    //             .create({
    //                 from: "whatsapp:+14155238886", // Twilio Sandbox Number
    //                 to: sender,
    //                 body: `${response.question}\n\nOptions: ${response.responses.join(", ")}`, // ✅ Send text with options
    //             })
    //             .then(message => console.log(`✅ Text Message Sent: ${message.sid}`))
    //             .catch(error => {
    //                 console.error("❌ Error sending text message:", error);
    //             });
    //     } catch (error) {
    //         console.error("❌ Critical Error (Skipping Twilio Message):", error);
    //     }
    // }
    // else {
    //     console.error("❌ No valid responses, skipping Twilio message.");
    // }
    res.send({ reply: response.question, Responses: response.responses });
});

module.exports = router;