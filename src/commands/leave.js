async function execute(sock, msg) {
  const jid = msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return sock.sendMessage(jid, { text: "❌ This command works in groups only." });
  }

  await sock.sendMessage(jid, { text: "👋 Leaving group..." });
  await sock.groupLeave(jid);
}

module.exports = { name: "leave", description: "Leave group", execute };
