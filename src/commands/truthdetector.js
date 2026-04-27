async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🕵️ *Truth Detector*\n\nAnalyzing... 73% truth detected 😂"
  });
}

module.exports = {
  name: "truthdetector",
  description: "Truth detector",
  execute
};
