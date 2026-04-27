async function execute(sock, msg, args) {
  const len = Math.min(parseInt(args[0]) || 12, 50);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let pass = "";

  for (let i = 0; i < len; i++) pass += chars[Math.floor(Math.random() * chars.length)];

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🔐 *Generated Password*\n\n" + pass
  });
}

module.exports = { name: "genpass", description: "Generate password", execute };
