async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🎧 *SHAZAM*\n\nReply to an audio with .shazam\n\n✅ Audio recognition API will be connected next."
  });
}

module.exports = { name: "shazam", description: "Recognize song from audio", execute };
