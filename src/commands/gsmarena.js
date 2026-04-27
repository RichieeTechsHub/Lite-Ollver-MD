async function execute(sock, msg, args) {
  const phone = args.join(" ");
  if (!phone) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .gsmarena Samsung A13" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "📱 *GSMARENA SEARCH*\n\nPhone: " + phone + "\n\nGSMArena API will be connected next."
  });
}

module.exports = { name: "gsmarena", description: "Phone specs search", execute };
