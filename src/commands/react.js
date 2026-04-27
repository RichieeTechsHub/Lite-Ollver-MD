async function execute(sock, msg, args) {
  const emoji = args[0] || "✅";

  await sock.sendMessage(msg.key.remoteJid, {
    react: {
      text: emoji,
      key: msg.key
    }
  });
}

module.exports = { name: "react", description: "React to command message", execute };
