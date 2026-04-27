async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *listcountrycode* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "listcountrycode", description: "listcountrycode command", execute };
