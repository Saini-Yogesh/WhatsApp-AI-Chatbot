const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

async function generateAIResponses(businessName, businessDescription) {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    console.error("Missing GEMINI_API_KEY in environment variables.");
    return [];
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `Generate a structured chatbot flow for ${businessName}, specializing in ${businessDescription}. 
    Each step should be a short question with exactly three selectable options. 
    Format your response strictly as a JSON array of objects. Do not include any HTML markdown tags or text outside of the JSON. Make sure valid JSON is returned.
    Example: 
    [
      { "bot": "Hello, how can I help?", "options": ["Option 1", "Option 2", "Option 3"] },
      { "bot": "What size?", "options": ["Small", "Medium", "Large"] }
    ]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Safety fallback parser if markdown was appended accidentally
    const jsonStr = responseText.replace(/```json|```/g, "").trim();
    const chatbotFlow = JSON.parse(jsonStr);

    return Array.isArray(chatbotFlow) ? chatbotFlow : [];
  } catch (error) {
    console.error(`❌ Error generating chatbot flow: ${error.message}`);
    return [];
  }
}

module.exports = { generateAIResponses };
