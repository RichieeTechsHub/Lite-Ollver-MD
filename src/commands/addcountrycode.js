async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *addcountrycode* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "addcountrycode", description: "addcountrycode command", execute };
