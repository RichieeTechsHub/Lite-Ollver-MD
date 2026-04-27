async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🎥 Reply to a sticker/GIF/audio with .tovideo. Video conversion engine will be connected next."
  });
}

module.exports = {
  name: "tovideo",
  description: "Convert media to video",
  execute
};
