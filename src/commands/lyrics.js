const axios = require("axios");

async function execute(sock, msg, args) {
  const song = args.join(" ");

  if (!song) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .lyrics song name"
    });
  }

  try {
    const { data } = await axios.get(`https://api.lyrics.ovh/v1/${song}`);

    await sock.sendMessage(msg.key.remoteJid, {
      text: `🎵 *Lyrics*\n\n${data.lyrics || "Not found"}`
    });

  } catch {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Lyrics not found."
    });
  }
}

module.exports = { name: "lyrics", execute };
