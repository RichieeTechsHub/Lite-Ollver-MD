async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤫 *TRUTH*\n\nWhat is something you've never told anyone?"
  });
}

module.exports = {
  name: "truth",
  description: "Get a random truth",
  execute
};
