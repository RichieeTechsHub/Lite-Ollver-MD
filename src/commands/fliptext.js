async function execute(sock, msg, args) {
  const text = args.join(" ");
  if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .fliptext hello" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: text.split("").reverse().join("")
  });
}

module.exports = { name: "fliptext", description: "Reverse text", execute };
