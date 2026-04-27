async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🖼️ Reply to sticker with .toimage. Conversion engine will be connected next."
  });
}

module.exports = { name: "toimage", description: "Convert sticker to image", execute };
