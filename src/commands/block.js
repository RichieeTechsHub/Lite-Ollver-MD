async function execute(sock, msg, args) {
  const number = args[0]?.replace(/[^0-9]/g, "");
  if (!number) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .block 2547xxxxxxx" });

  await sock.updateBlockStatus(number + "@s.whatsapp.net", "block");
  await sock.sendMessage(msg.key.remoteJid, { text: "✅ User blocked." });
}

module.exports = { name: "block", description: "Block user", execute };
