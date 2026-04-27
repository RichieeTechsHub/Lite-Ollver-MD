async function execute(sock, msg, args) {
  try {
    const target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || msg.key.participant || msg.key.remoteJid;
    const url = await sock.profilePictureUrl(target, "image");

    await sock.sendMessage(msg.key.remoteJid, {
      image: { url },
      caption: "🖼️ Profile Picture"
    });
  } catch {
    await sock.sendMessage(msg.key.remoteJid, { text: "❌ Failed to get profile picture." });
  }
}

module.exports = { name: "getpp", description: "Get profile picture", execute };
