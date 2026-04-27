async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "💬 *Quote*\n\nSuccess is not final, failure is not fatal: it is the courage to continue that counts."
  });
}

module.exports = {
  name: "quotes",
  description: "Motivational quote",
  execute
};
