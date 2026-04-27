async function execute(sock, msg, args) {
  const text = args.join(" ");
  if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .say hello" });

  await sock.sendMessage(msg.key.remoteJid, { text });
}

module.exports = { name: "say", description: "Repeat text", execute };
