const axios = require("axios");

function pickUrl(obj) {
  if (!obj || typeof obj !== "object") return null;

  const possible =
    obj.url ||
    obj.video ||
    obj.videoUrl ||
    obj.downloadUrl ||
    obj.download_url ||
    obj.nowm ||
    obj.no_watermark ||
    obj.play ||
    obj.hdplay;

  if (typeof possible === "string" && possible.startsWith("http")) return possible;

  for (const value of Object.values(obj)) {
    if (typeof value === "string" && value.startsWith("http")) return value;
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = pickUrl(item);
        if (found) return found;
      }
    }
    if (typeof value === "object") {
      const found = pickUrl(value);
      if (found) return found;
    }
  }

  return null;
}

async function fetchBuffer(url) {
  const res = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 120000,
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  return Buffer.from(res.data);
}

async function execute(sock, msg, args) {
  const url = args[0];

  if (!url) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .tiktok TikTok-link",
    });
  }

  try {
    await sock.sendMessage(msg.key.remoteJid, { text: "⏳ Fetching TikTok video..." });

    const endpoints = [
      "https://api.agatz.xyz/api/tiktok?url=" + encodeURIComponent(url),
      "https://api.agatz.xyz/api/tiktok2?url=" + encodeURIComponent(url),
    ];

    let mediaUrl = null;

    for (const api of endpoints) {
      try {
        const { data } = await axios.get(api, { timeout: 60000 });
        mediaUrl = pickUrl(data);
        if (mediaUrl) break;
      } catch {}
    }

    if (!mediaUrl) throw new Error("No media URL found");

    const buffer = await fetchBuffer(mediaUrl);

    await sock.sendMessage(msg.key.remoteJid, {
      video: buffer,
      mimetype: "video/mp4",
      caption: "✅ TikTok video",
    });
  } catch (err) {
    console.log("TikTok error:", err.message);
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ TikTok download failed. Try another public link.",
    });
  }
}

module.exports = {
  name: "tiktok",
  description: "Download TikTok video",
  execute,
};
