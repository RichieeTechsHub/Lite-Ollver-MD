async function execute(sock, msg, args) {
  const place = args.join(" ");
  if (!place) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .weather Nairobi" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🌦️ *WEATHER*\n\nLocation: " + place + "\n\n✅ Weather command active. Weather API will be connected next."
  });
}

module.exports = { name: "weather", description: "Check weather", execute };
