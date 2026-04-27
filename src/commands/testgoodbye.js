async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *testgoodbye* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "testgoodbye", description: "testgoodbye command", execute };
