async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *testanticallmsg* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "testanticallmsg", description: "testanticallmsg command", execute };
