async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "⚡ *XXQC Mode*\n\nCommand active. Reaction engine will be upgraded later."
  });
}

module.exports = {
  name: "xxqc",
  description: "Fun reaction",
  execute
};
