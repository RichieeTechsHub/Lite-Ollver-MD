async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setprofilepic* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "setprofilepic", description: "setprofilepic command", execute };
