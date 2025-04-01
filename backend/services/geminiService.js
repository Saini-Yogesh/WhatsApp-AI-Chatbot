const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

async function generateAIResponses(businessName, businessDescription) {
  const API_KEY = process.env.GEMINI_API_KEY;
  try {
    if (!API_KEY) {
      console.error("Missing GEMINI_API_KEY in environment variables.");
      return [];
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Generate a structured chatbot flow for ${businessName}, specializing in ${businessDescription}. 
              Each step should be a short question with three selectable options only. 
              Format strictly as:
              Bot: [Short question]
              Options: Option 1 | Option 2 | Option 3
              No explanations, introductions, or additional text—only the structured output.`,
            },
          ],
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (responseText) {
      const chatbotFlow = [];
      const flowMatches = responseText.split(/(?=Bot:)/g).filter(item => item.trim());

      for (const step of flowMatches) {
        const botMatch = step.match(/Bot:(.+)/i);
        const optionsMatch = step.match(/Options:(.+)/i);

        if (botMatch && optionsMatch) {
          chatbotFlow.push({
            bot: botMatch[1].trim(),
            options: optionsMatch[1].split("|").map(opt => opt.trim()), // Ensure options are properly split
          });
        }
      }

      return chatbotFlow;
    }


    return [];
  } catch (error) {
    console.error(`❌ Error generating chatbot flow: ${error.message}`);
    return [];
  }
}

module.exports = { generateAIResponses };
