async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, { text: "♻️ Restarting bot..." });
  setTimeout(() => process.exit(1), 1000);
}

module.exports = { name: "restart", description: "Restart bot", execute };
