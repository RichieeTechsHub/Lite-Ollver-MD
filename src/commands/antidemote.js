async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *antidemote* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "antidemote", description: "antidemote command", execute };
