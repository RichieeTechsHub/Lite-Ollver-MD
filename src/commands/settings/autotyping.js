const { isOwner } = require("../../bot/permissions");
const { saveSettings } = require("../../bot/handler");

module.exports = {
  name: "autotyping",
  description: "Toggle autotyping",

  async execute({ reply, senderJid, args, settings }) {
    if (!isOwner(senderJid)) {
      return reply("❌ Only the owner can change this setting.");
    }

    const value = (args[0] || "").toLowerCase();

    if (!["on", "off"].includes(value)) {
      return reply(`⚠️ Usage: ${settings.prefix}autotyping on/off`);
    }

    settings.autotyping = value === "on";
    await saveSettings(settings);

    await reply(`✅ autotyping is now ${value.toUpperCase()}.`);
  }
};