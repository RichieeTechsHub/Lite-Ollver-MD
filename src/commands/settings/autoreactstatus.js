const { isOwner } = require("../../bot/permissions");
const { saveSettings } = require("../../bot/handler");

module.exports = {
  name: "autoreactstatus",
  description: "Toggle autoreact status",

  async execute({ reply, senderJid, args, settings }) {
    if (!isOwner(senderJid)) {
      return reply("❌ Only the owner can change this setting.");
    }

    const value = (args[0] || "").toLowerCase();

    if (!["on", "off"].includes(value)) {
      return reply(`⚠️ Usage: ${settings.prefix}autoreactstatus on/off`);
    }

    settings.autoreactstatus = value === "on";
    await saveSettings(settings);

    await reply(`✅ autoreactstatus is now ${value.toUpperCase()}.`);
  }
};