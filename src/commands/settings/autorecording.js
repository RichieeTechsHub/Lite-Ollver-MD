const { isOwner } = require("../../bot/permissions");
const { saveSettings } = require("../../bot/handler");

module.exports = {
  name: "autorecording",
  description: "Toggle autorecording",

  async execute({ reply, senderJid, args, settings }) {
    if (!isOwner(senderJid)) {
      return reply("❌ Only the owner can change this setting.");
    }

    const value = (args[0] || "").toLowerCase();

    if (!["on", "off"].includes(value)) {
      return reply(`⚠️ Usage: ${settings.prefix}autorecording on/off`);
    }

    settings.autorecording = value === "on";
    await saveSettings(settings);

    await reply(`✅ autorecording is now ${value.toUpperCase()}.`);
  }
};