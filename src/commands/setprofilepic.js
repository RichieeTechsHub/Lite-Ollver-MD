async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🖼️ Reply to an image with .setprofilepic. Image upload logic will be finalized after media tools."
  });
}

module.exports = { name: "setprofilepic", description: "Set profile picture", execute };
