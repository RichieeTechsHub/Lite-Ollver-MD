const { readSettings, writeSettings } = require("../lib/botSettings");

function cleanNumber(value = "") {
  return String(value).replace(/\D/g, "");
}

function getSender(msg) {
  return cleanNumber(msg.key.participant || msg.key.remoteJid || "");
}

function getBotNumber(sock) {
  return cleanNumber(sock.user?.id || "");
}

async function execute(sock, msg, args, ctx) {
  const settings = await readSettings();

  const sender = getSender(msg);
  const botNumber = getBotNumber(sock);
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

  const mode = (args[0] || "").toLowerCase();

  if (!["public", "private"].includes(mode)) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ Usage:\n\n.mode public\n.mode private",
    });
  }

  settings.mode = mode;
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      `✅ Mode changed to *${mode}*\n\n` +
      (mode === "private"
        ? "🔒 Only owner, bot host and sudo can use commands."
        : "🌍 Everyone can use commands."),
  });
}

module.exports = {
  name: "mode",
  description: "Switch bot mode",
  execute,
};
