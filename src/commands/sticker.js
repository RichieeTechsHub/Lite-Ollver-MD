async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🎭 Reply to an image/video with .sticker. Sticker engine will be connected next."
  });
}

module.exports = { name: "sticker", description: "Create sticker", execute };
