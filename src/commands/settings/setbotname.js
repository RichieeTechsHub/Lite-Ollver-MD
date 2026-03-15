const { isOwner } = require("../../bot/permissions");
const { saveSettings } = require("../../bot/handler");

module.exports = {
  name: "setbotname",
  description: "Set bot name",

  async execute({ reply, senderJid, text, settings }) {
    if (!isOwner(senderJid)) {
      return reply("❌ Only the owner can change bot name.");
    }

    const value = text.trim();

    if (!value) {
      return reply("⚠️ Usage: .setbotname Lite-Ollver-MD");
    }

    settings.botName = value;
    await saveSettings(settings);

    await reply(`✅ Bot name updated to: ${settings.botName}`);
  }
};