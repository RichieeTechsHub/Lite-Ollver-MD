async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *announcements* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "announcements", description: "announcements command", execute };
