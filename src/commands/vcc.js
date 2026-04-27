async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "📇 VCC command active. Contact conversion engine will be connected next."
  });
}

module.exports = { name: "vcc", description: "VCC contact tool", execute };
