const { isOwner } = require("../../bot/permissions");
const { saveSettings } = require("../../bot/handler");

module.exports = {
  name: "setownername",
  description: "Set owner name",

  async execute({ reply, senderJid, text, settings }) {
    if (!isOwner(senderJid)) {
      return reply("❌ Only the owner can change owner name.");
    }

    const value = text.trim();

    if (!value) {
      return reply("⚠️ Usage: .setownername YourName");
    }

    settings.ownerName = value;
    await saveSettings(settings);

    await reply(`✅ Owner name updated to: ${settings.ownerName}`);
  }
};