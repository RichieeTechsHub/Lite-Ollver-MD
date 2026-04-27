async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *listrequests* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "listrequests", description: "listrequests command", execute };
