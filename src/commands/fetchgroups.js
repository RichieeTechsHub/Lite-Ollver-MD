async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *fetchgroups* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "fetchgroups", description: "fetchgroups command", execute };
