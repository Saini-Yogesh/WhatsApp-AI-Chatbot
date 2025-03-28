// ngrok http 8000 
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const twilio = require("twilio");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

// Webhook to receive WhatsApp messages
app.post("/webhook", async (req, res) => {
    console.log("i am calling");
    const message = req.body.Body.trim();
    const sender = req.body.From;

    console.log(`Received message: ${message} from ${sender}`);

    // Predefined Q&A
    const predefinedQA = {
        "hello": "Hi! How can I assist you today?",
        "pricing": "Our pricing plans start from $10/month. Let me know if you need details.",
        "services": "We offer AI chatbots, automation services, and much more!"
    };

    let reply = "Now I am working";

    // Check predefined responses
    if (predefinedQA[message.toLowerCase()]) {
        reply = predefinedQA[message.toLowerCase()];
    } else {
        // Generate AI response
        try {
            const API_KEY = process.env.GEMINI_API_KEY;
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

            const payload = {
                contents: [{ parts: [{ text: message }] }]
            };

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            // console.log(data)
            reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
        } catch (error) {
            console.error("Error generating AI response:", error);
            reply = "Sorry, I am facing some issues right now.";
        }
    }

    // console.log(reply);
    // Send response via Twilio WhatsApp
    twilioClient.messages
        .create({
            body: reply,
            from: "whatsapp:+14155238886", // Twilio Sandbox Number
            to: sender
        })
        .then(message => console.log(`Sent message SID: ${message.sid}`))
        .catch(error => console.error("Error sending message:", error));

    // const twiml = new twilio.twiml.MessagingResponse();
    // res.type('text/xml').send(twiml.toString());

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(reply);
    res.type('text/xml').send(twiml.toString());
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
