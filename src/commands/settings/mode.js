const { isOwner } = require("../../bot/permissions");
const { saveSettings } = require("../../bot/handler");

module.exports = {
  name: "mode",
  description: "Change bot mode",

  async execute({ reply, senderJid, args, settings }) {
    if (!isOwner(senderJid)) {
      return reply("❌ Only the owner can change bot mode.");
    }

    const value = (args[0] || "").toLowerCase();

    if (!["public", "private"].includes(value)) {
      return reply("⚠️ Usage: .mode public or .mode private");
    }

    settings.mode = value;
    await saveSettings(settings);

    await reply(`✅ Bot mode changed successfully.\n\nCurrent Mode: ${value}`);
  }
};