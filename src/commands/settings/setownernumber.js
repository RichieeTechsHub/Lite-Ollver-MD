const { isOwner, cleanNumber } = require("../../bot/permissions");
const { saveSettings } = require("../../bot/handler");

module.exports = {
  name: "setownernumber",
  description: "Set owner number",

  async execute({ reply, senderJid, text, settings }) {
    if (!isOwner(senderJid)) {
      return reply("❌ Only the owner can change owner number.");
    }

    const number = cleanNumber(text);

    if (!number) {
      return reply("⚠️ Usage: .setownernumber 2547XXXXXXXX");
    }

    settings.ownerNumber = number;
    settings.ownerContact = `https://wa.me/${number}`;
    await saveSettings(settings);

    await reply(`✅ Owner number updated to: ${number}`);
  }
};