async function execute(sock, msg) {
  const jid = msg.key.remoteJid;
  const sender = msg.key.participant || jid;
  await sock.sendMessage(jid, { text: "🆔 Your ID:\n" + sender });
}

module.exports = { name: "userid", description: "Show user ID", execute };
