async function execute(sock, msg, args) {
  const bio = args.join(" ");
  if (!bio) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .setbio new bio" });

  await sock.updateProfileStatus(bio);
  await sock.sendMessage(msg.key.remoteJid, { text: "✅ Bio updated." });
}

module.exports = { name: "setbio", description: "Set bot bio", execute };
