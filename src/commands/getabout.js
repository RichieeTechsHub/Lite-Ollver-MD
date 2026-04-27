async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "ℹ️ *GET ABOUT*\n\nWhatsApp about/status fetch will be connected next."
  });
}

module.exports = { name: "getabout", description: "Get user about", execute };
