async function execute(sock, msg, args) {
  const number = args[0]?.replace(/[^0-9]/g, "");
  if (!number) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .unblock 2547xxxxxxx" });

  await sock.updateBlockStatus(number + "@s.whatsapp.net", "unblock");
  await sock.sendMessage(msg.key.remoteJid, { text: "✅ User unblocked." });
}

module.exports = { name: "unblock", description: "Unblock user", execute };
