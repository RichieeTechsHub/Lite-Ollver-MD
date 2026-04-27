async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setprefix* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "setprefix", description: "setprefix command", execute };
