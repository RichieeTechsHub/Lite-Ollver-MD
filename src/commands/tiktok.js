const { getTikTokNoWatermark, downloadBuffer } = require("../lib/realDownloader");

async function execute(sock, msg, args) {
  const url = args[0];

  if (!url || !url.includes("tiktok")) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .tiktok TikTok link"
    });
  }

  try {
    await sock.sendMessage(msg.key.remoteJid, { text: "🎬 Downloading TikTok..." });

    const data = await getTikTokNoWatermark(url);
    const buffer = await downloadBuffer(data.videoUrl);

    await sock.sendMessage(msg.key.remoteJid, {
      video: buffer,
      mimetype: "video/mp4",
      caption: data.title || "TikTok video"
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ TikTok download failed: " + err.message
    });
  }
}

module.exports = {
  name: "tiktok",
  description: "Download TikTok video",
  execute
};
