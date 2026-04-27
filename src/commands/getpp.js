async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *getpp* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "getpp", description: "getpp command", execute };
