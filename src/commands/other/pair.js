module.exports = {
  name: "pair",
  description: "Show session generator link",

  async execute({ reply }) {

    const text = [
      "🔗 *Lite-Ollver-MD Session Generator*",
      "",
      "Generate your WhatsApp session using the link below:",
      "",
      "🌐 https://your-session-generator.onrender.com",
      "",
      "After generating your session:",
      "1️⃣ Copy SESSION_ID",
      "2️⃣ Paste into Heroku Config Vars",
      "3️⃣ Restart the bot",
      "",
      "👥 Support Group:",
      "https://chat.whatsapp.com/JKF3XHbmKY47IQZc7d3LB2"
    ].join("\n");

    await reply(text);

  }
};