const axios = require("axios");
const cheerio = require("cheerio");

async function execute(sock, msg, args) {
  const url = args[0];

  if (!url || !url.includes("mediafire.com")) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .mediafire MediaFire-link",
    });
  }

  try {
    await sock.sendMessage(msg.key.remoteJid, { text: "⏳ Fetching MediaFire file..." });

    const { data: html } = await axios.get(url, {
      timeout: 60000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(html);
    const downloadUrl = $("#downloadButton").attr("href");

    if (!downloadUrl) throw new Error("Download button not found");

    await sock.sendMessage(msg.key.remoteJid, {
      document: { url: downloadUrl },
      fileName: "mediafire-file",
      mimetype: "application/octet-stream",
      caption: "✅ MediaFire file",
    });
  } catch (err) {
    console.log("MediaFire error:", err.message);
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ MediaFire download failed. Make sure the link is public.",
    });
  }
}

module.exports = {
  name: "mediafire",
  description: "Download MediaFire files",
  execute,
};
