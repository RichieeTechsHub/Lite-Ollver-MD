async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *wallpaper* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "wallpaper", description: "wallpaper command", execute };
