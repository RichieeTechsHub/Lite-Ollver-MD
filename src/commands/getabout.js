async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *getabout* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "getabout", description: "getabout command", execute };
