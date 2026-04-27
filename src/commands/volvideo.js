async function execute(sock, msg, args) {
  const level = args[0] || "2";

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🔊 *VIDEO VOLUME*\n\n" +
      "Volume level: " + level + "x\n\n" +
      "Reply to a video with .volvideo 2. FFmpeg video audio-volume engine will be connected next."
  });
}

module.exports = {
  name: "volvideo",
  description: "Increase video volume",
  execute
};
