async function execute(sock, msg, args) {
  const text = args.join(" ");
  if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .texttopdf your text" });

  await sock.sendMessage(msg.key.remoteJid, {
    document: Buffer.from(text),
    fileName: "Lite-Ollver-MD.txt",
    mimetype: "text/plain",
    caption: "📄 Text file created. PDF engine will be connected next."
  });
}

module.exports = { name: "texttopdf", description: "Convert text to document", execute };
