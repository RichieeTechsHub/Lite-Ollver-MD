const { isOwner } = require("../../bot/permissions");
const { saveSettings } = require("../../bot/handler");

module.exports = {
  name: "setstatusemoji",
  description: "Set status reaction emoji",

  async execute({ reply, senderJid, text, settings }) {
    if (!isOwner(senderJid)) {
      return reply("❌ Only the owner can change status emoji.");
    }

    const value = text.trim();

    if (!value) {
      return reply("⚠️ Usage: .setstatusemoji ❤️");
    }

    settings.statusEmoji = value;
    await saveSettings(settings);

    await reply(`✅ Status emoji updated to: ${settings.statusEmoji}`);
  }
};