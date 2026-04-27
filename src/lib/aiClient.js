const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

async function askGemini(prompt, system = "You are Lite-Ollver-MD, a helpful WhatsApp bot assistant.") {
  if (!GEMINI_API_KEY) {
    return "❌ Gemini API key missing. Add GEMINI_API_KEY in your .env file.";
  }

  try {
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      GEMINI_MODEL +
      ":generateContent?key=" +
      GEMINI_API_KEY;

    const { data } = await axios.post(
      url,
      {
        contents: [
          {
            parts: [
              {
                text: system + "\n\nUser request:\n" + prompt
              }
            ]
          }
        ]
      },
      {
        timeout: 60000,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "❌ Gemini returned no response."
    );
  } catch (err) {
    return "❌ Gemini error: " + (err.response?.data?.error?.message || err.message);
  }
}

module.exports = {
  askGemini
};
