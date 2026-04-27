async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🎧 Reply to a video with .toaudio. Video-to-audio engine will be connected next."
  });
}

module.exports = {
  name: "toaudio",
  description: "Convert video to audio",
  execute
};
