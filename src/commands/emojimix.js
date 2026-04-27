async function execute(sock, msg, args) {
  const input = args.join(" ");
  if (!input) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .emojimix 😂+🔥" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "😀 *Emoji Mix*\n\nInput: " + input + "\n\nEmoji image API will be connected next."
  });
}

module.exports = { name: "emojimix", description: "Mix emojis", execute };
