async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤣 *Meme Mode*\n\nMemes command is active. Image meme API will be connected later."
  });
}

module.exports = {
  name: "memes",
  description: "Meme command",
  execute
};
