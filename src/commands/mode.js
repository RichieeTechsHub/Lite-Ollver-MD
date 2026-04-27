const { readSettings, writeSettings } = require("../lib/botSettings");

function cleanNumber(value = "") {
  return String(value).replace(/\D/g, "");
}

async function execute(sock, msg, args, ctx) {
  const sender =
    (msg.key.participant || msg.key.remoteJid || "")
      .split("@")[0]
      .split(":")[0];

  const cleanSender = cleanNumber(sender);
  const cleanOwner = cleanNumber(ctx.OWNER_NUMBER);

  const settings = await readSettings();
  const sudo = Array.isArray(settings.sudo) ? settings.sudo : [];

  const isOwner = cleanSender === cleanOwner;
  const isSudo = sudo.includes(cleanSender);

  // 🔐 Only owner/sudo can switch mode
  if (!isOwner && !isSudo) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Only owner or sudo can change mode.",
    });
  }

  const input = (args[0] || "").toLowerCase();

  if (!["public", "private"].includes(input)) {
    return sock.sendMessage(msg.key.remoteJid, {
      text:
        "⚙️ Usage:\n\n" +
        ".mode public\n" +
        ".mode private",
    });
  }

  settings.mode = input;
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      `✅ Bot mode updated to *${input.toUpperCase()}*\n\n` +
      (input === "private"
        ? "🔒 Only owner & sudo can use commands"
        : "🌍 Everyone can use the bot"),
  });
}

module.exports = {
  name: "mode",
  description: "Switch bot mode (public/private)",
  execute,
};
