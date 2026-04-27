async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setmenu* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "setmenu", description: "setmenu command", execute };
