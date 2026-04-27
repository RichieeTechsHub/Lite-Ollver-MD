async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🧠 *Random Fact*\n\nHoney never spoils. Archaeologists have found edible honey in ancient Egyptian tombs."
  });
}

module.exports = {
  name: "fact",
  description: "Random fact",
  execute
};
