const { isOwner, cleanNumber, removeSudo } = require("../../bot/permissions");

module.exports = {
  name: "delsudo",
  description: "Remove a sudo user",

  async execute({ reply, senderJid, text }) {
    if (!isOwner(senderJid)) {
      return reply("❌ Only the owner can remove sudo users.");
    }

    const number = cleanNumber(text);

    if (!number) {
      return reply("⚠️ Usage: .delsudo 2547XXXXXXXX");
    }

    await removeSudo(number);
    await reply(`✅ Removed sudo user: ${number}`);
  }
};