const { readSettings, writeSettings } = require("../lib/botSettings");

function cleanNumber(value = "") {
  return String(value).replace(/\D/g, "");
}

async function execute(sock, msg, args, ctx) {
  const settings = await readSettings();

  const sender = cleanNumber(msg.key.participant || msg.key.remoteJid || "");
  const botNumber = cleanNumber(sock.user?.id || "");
  const owner = cleanNumber(settings.ownerNumber || ctx.OWNER_NUMBER);
  const sudo = Array.isArray(settings.sudo) ? settings.sudo.map(cleanNumber) : [];

  const allowed =
    msg.key.fromMe ||
    sender === owner ||
    sender === botNumber ||
    sudo.includes(sender);

  if (!allowed) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Only owner, bot host or sudo can change mode.",
    });
  }

  const input = (args[0] || "").toLowerCase();

  if (!["public", "private"].includes(input)) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ Usage:\n.mode public\n.mode private",
    });
  }

  settings.mode = input;
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      `✅ Mode changed to *${input.toUpperCase()}*\n\n` +
      (input === "private"
        ? "🔒 Only owner, bot host and sudo can use commands."
        : "🌍 Everyone can use commands."),
  });
}

module.exports = {
  name: "mode",
  description: "Switch bot mode public/private",
  execute,
};
