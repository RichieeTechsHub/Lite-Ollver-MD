const { isOwner } = require("../../bot/permissions");
const { saveSettings } = require("../../bot/handler");

module.exports = {
  name: "statusdelay",
  description: "Set status delay",

  async execute({ reply, senderJid, args, settings }) {
    if (!isOwner(senderJid)) {
      return reply("❌ Only the owner can change status delay.");
    }

    const delay = Number(args[0]);

    if (Number.isNaN(delay) || delay < 0) {
      return reply("⚠️ Usage: .statusdelay 10");
    }

    settings.statusDelay = delay;
    await saveSettings(settings);

    await reply(`✅ Status delay updated to: ${delay} second(s)`);
  }
};