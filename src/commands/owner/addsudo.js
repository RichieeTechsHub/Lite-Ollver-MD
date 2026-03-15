const { isOwner, cleanNumber, addSudo } = require("../../bot/permissions");

module.exports = {
  name: "addsudo",
  description: "Add a sudo user",

  async execute({ reply, senderJid, text }) {
    if (!isOwner(senderJid)) {
      return reply("❌ Only the owner can add sudo users.");
    }

    const number = cleanNumber(text);

    if (!number) {
      return reply("⚠️ Usage: .addsudo 2547XXXXXXXX");
    }

    await addSudo(number);
    await reply(`✅ Added sudo user: ${number}`);
  }
};