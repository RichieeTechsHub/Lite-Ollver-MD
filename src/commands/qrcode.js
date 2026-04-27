async function execute(sock, msg, args) {
  const text = args.join(" ");
  if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .qrcode text/link" });

  const url = "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=" + encodeURIComponent(text);

  await sock.sendMessage(msg.key.remoteJid, {
    image: { url },
    caption: "✅ QR Code generated"
  });
}

module.exports = { name: "qrcode", description: "Generate QR code", execute };
