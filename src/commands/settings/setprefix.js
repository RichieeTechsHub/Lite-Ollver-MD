const { isOwner } = require("../../bot/permissions");
const { saveSettings } = require("../../bot/handler");

module.exports = {
  name: "setprefix",
  description: "Set bot prefix",

  async execute({ reply, senderJid, text, settings }) {
    if (!isOwner(senderJid)) {
      return reply("❌ Only the owner can change prefix.");
    }

    const newPrefix = text.trim();

    if (!newPrefix) {
      return reply("⚠️ Usage: .setprefix !");
    }

    settings.prefix = newPrefix;
    await saveSettings(settings);

    await reply(`✅ Prefix changed successfully.\n\nNew Prefix: ${newPrefix}`);
  }
};