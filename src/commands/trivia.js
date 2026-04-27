async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🎯 *Trivia*\n\nQuestion: What planet is known as the Red Planet?\n\nAnswer: Mars."
  });
}

module.exports = {
  name: "trivia",
  description: "Trivia question",
  execute
};
