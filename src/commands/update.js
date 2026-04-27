async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "⬆️ *UPDATE INFO*\n\n" +
      "Push latest files to GitHub, then restart Heroku worker."
  });
}

module.exports = { name: "update", description: "Update info", execute };
