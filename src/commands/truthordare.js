async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🎲 *TRUTH OR DARE*\n\nType:\n.truth OR .dare"
  });
}

module.exports = {
  name: "truthordare",
  description: "Play truth or dare",
  execute
};
