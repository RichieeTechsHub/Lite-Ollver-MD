async function askAI(prompt, system = "You are Lite-Ollver-MD, a helpful WhatsApp bot assistant.") {
  const key = process.env.OPENAI_API_KEY;

  if (!key) {
    return "❌ AI is not configured.\n\nAdd OPENAI_API_KEY in Heroku Config Vars.";
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return "❌ AI error: " + (data.error?.message || "Request failed");
    }

    return data.choices?.[0]?.message?.content || "❌ No AI response.";
  } catch (err) {
    return "❌ AI failed: " + err.message;
  }
}

module.exports = { askAI };
