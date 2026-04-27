async function execute(sock, msg, args) {
  const link = args[0];
  if (!link || !link.includes("chat.whatsapp.com/")) {
    return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .join https://chat.whatsapp.com/JKF3XHbmKY47IQZc7d3LB2?mode=gi_t" });
  }

  const code = link.split("chat.whatsapp.com/")[1].trim();
  await sock.groupAcceptInvite(code);
  await sock.sendMessage(msg.key.remoteJid, { text: "✅ Joined group successfully." });
}

module.exports = { name: "join", description: "Join group by invite", execute };
