async function execute(sock, msg) {
  const now = new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" });
  await sock.sendMessage(msg.key.remoteJid, { text: "🕒 Kenya Time: " + now });
}

module.exports = { name: "time", description: "Show current time", execute };
