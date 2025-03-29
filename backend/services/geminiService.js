const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const { geminiClient, GEMINI_API_KEY } = require("../config/geminiClient");

async function generateAIResponses(businessName, businessDescription) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error("Missing GEMINI_API_KEY in environment variables.");
      return []; // Return empty array to avoid breaking the registration flow
    }

    // Log only the first few characters of the key to verify it's being read
    // console.log(`Using API key starting with: ${API_KEY.substring(0, 5)}...`);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    // console.log("🔗 API URL:", url);

    const payload = {
      contents: [
        {
          parts: [
            { text: `Generate 5 FAQs for ${businessName}, which specializes in ${businessDescription}. Format each FAQ as 'Q: [question] A: [answer]'` },
          ],
        },
      ],
    };

    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });

    // console.log("✅ API Response:", JSON.stringify(response.data, null, 2));

    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    // Parse the text into an array of Q&A objects
    if (responseText) {
      // Basic parsing assuming format "Q: [question] A: [answer]"
      const faqArray = [];
      const faqMatches = responseText.split(/\d+\.\s+/g).filter(item => item.trim());

      // If the split didn't work, try to handle it as a single block
      if (faqMatches.length === 0 && responseText.includes('Q:') && responseText.includes('A:')) {
        const qaPairs = responseText.split(/(?=Q:)/g).filter(qa => qa.trim());

        for (const qa of qaPairs) {
          const qMatch = qa.match(/Q:([^A]+)/i);
          const aMatch = qa.match(/A:(.+)(?:\n|$)/is);

          if (qMatch && aMatch) {
            faqArray.push({
              question: qMatch[1].trim(),
              answer: aMatch[1].trim()
            });
          }
        }
      } else {
        // Process the matches from the numbered format
        for (const faq of faqMatches) {
          const qMatch = faq.match(/Q:([^A]+)/i);
          const aMatch = faq.match(/A:(.+)(?:\n|$)/is);

          if (qMatch && aMatch) {
            faqArray.push({
              question: qMatch[1].trim(),
              answer: aMatch[1].trim()
            });
          }
        }
      }

      return faqArray;
    }

    return []; // Return empty array if no valid response
  } catch (error) {
    console.error(
      `❌ Error generating AI responses: ${error.response?.status || "Unknown Status"
      } - ${error.response?.data?.error?.message || error.message}`
    );
    return [];
  }
}

module.exports = { generateAIResponses };