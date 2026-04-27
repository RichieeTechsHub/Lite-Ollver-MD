async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .bible John 3:16"
    });
  }

  try {
    const res = await fetch("https://bible-api.com/" + encodeURIComponent(query));
    const data = await res.json();

    if (!data.text) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Verse not found. Example: .bible John 3:16"
      });
    }

    await sock.sendMessage(msg.key.remoteJid, {
      text:
        "📖 *" + (data.reference || query) + "*\n\n" +
        data.text.trim() +
        "\n\n_" + (data.translation_name || "Bible") + "_"
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Bible lookup failed. Try again later."
    });
  }
}

module.exports = {
  name: "bible",
  description: "Search Bible verse",
  execute
};
