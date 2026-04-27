const axios = require("axios");

async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .quran 1:1"
    });
  }

  try {
    const [surah, ayah] = query.split(":");

    const { data } = await axios.get(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.asad`);

    await sock.sendMessage(msg.key.remoteJid, {
      text:
        `☪️ *Quran ${surah}:${ayah}*\n\n` +
        data.data.text
    });
  } catch {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Quran verse not found. Example: .quran 1:1"
    });
  }
}

module.exports = {
  name: "quran",
  description: "Search Quran ayah",
  execute
};
