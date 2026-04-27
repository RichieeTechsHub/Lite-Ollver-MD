const { getTikTokNoWatermark, downloadBuffer } = require("../lib/realDownloader");

async function execute(sock, msg, args) {
  const url = args[0];

  if (!url || !url.includes("tiktok")) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .tiktokaudio TikTok link"
    });
  }

  try {
    await sock.sendMessage(msg.key.remoteJid, { text: "🎵 Downloading TikTok audio..." });

    const data = await getTikTokNoWatermark(url);

    if (!data.musicUrl) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ No TikTok audio found."
      });
    }

    const buffer = await downloadBuffer(data.musicUrl);

    await sock.sendMessage(msg.key.remoteJid, {
      audio: buffer,
      mimetype: "audio/mpeg",
      fileName: "tiktok-audio.mp3"
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ TikTok audio failed: " + err.message
    });
  }
}

module.exports = {
  name: "tiktokaudio",
  description: "Download TikTok audio",
  execute
};
