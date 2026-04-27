async function execute(sock, msg, args) {
  const code = args.join(" ");
  if (!code) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .obfuscate your code" });

  const encoded = Buffer.from(code).toString("base64");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🧩 *OBFUSCATED BASE64*\n\n" + encoded
  });
}

module.exports = { name: "obfuscate", description: "Obfuscate text/code", execute };
