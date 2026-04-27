async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *antigroupmention* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "antigroupmention", description: "antigroupmention command", execute };
