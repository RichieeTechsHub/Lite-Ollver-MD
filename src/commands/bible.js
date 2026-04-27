const axios = require("axios");

async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .bible John 3:16"
    });
  }

  try {
    const { data } = await axios.get("https://bible-api.com/" + encodeURIComponent(query));

    if (!data.text) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Verse not found."
      });
    }

    await sock.sendMessage(msg.key.remoteJid, {
      text:
        `📖 *${data.reference}*\n\n` +
        data.text.trim() +
        `\n\n_${data.translation_name || "Bible"}_`
    });
  } catch {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Bible lookup failed."
    });
  }
}

module.exports = {
  name: "bible",
  description: "Search Bible verse",
  execute
};
