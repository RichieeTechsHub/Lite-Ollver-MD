async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setstickerauthor* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "setstickerauthor", description: "setstickerauthor command", execute };
