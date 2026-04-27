async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🎭 Reply to a sticker with .take packname|author. Sticker metadata engine will be connected next."
  });
}

module.exports = { name: "take", description: "Take sticker", execute };
