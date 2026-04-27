async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🏟️ Champions League matches command active.\n\nLive API support will use FOOTBALL_API_KEY later."
  });
}

module.exports = {
  name: "clmatches",
  description: "Champions League matches",
  execute
};
