async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "😂 *Joke*\n\nWhy did the developer go broke? Because he used up all his cache."
  });
}

module.exports = {
  name: "jokes",
  description: "Random joke",
  execute
};
