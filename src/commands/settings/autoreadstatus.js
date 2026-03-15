const { isOwner } = require("../../bot/permissions");
const { saveSettings } = require("../../bot/handler");

module.exports = {
  name: "autoreadstatus",
  description: "Toggle autoread status",

  async execute({ reply, senderJid, args, settings }) {
    if (!isOwner(senderJid)) {
      return reply("❌ Only the owner can change this setting.");
    }

    const value = (args[0] || "").toLowerCase();

    if (!["on", "off"].includes(value)) {
      return reply(`⚠️ Usage: ${settings.prefix}autoreadstatus on/off`);
    }

    settings.autoreadstatus = value === "on";
    await saveSettings(settings);

    await reply(`✅ autoreadstatus is now ${value.toUpperCase()}.`);
  }
};