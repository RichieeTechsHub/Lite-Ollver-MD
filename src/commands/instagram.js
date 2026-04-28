const axios = require("axios");

function pickUrl(obj) {
  if (!obj || typeof obj !== "object") return null;

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
      text: "❌ Usage: .instagram Instagram-link",
    });
  }

  try {
    await sock.sendMessage(msg.key.remoteJid, { text: "⏳ Fetching Instagram media..." });

    const { data } = await axios.get(
      "https://api.agatz.xyz/api/instagram?url=" + encodeURIComponent(url),
      { timeout: 90000 }
    );

    const mediaUrl = pickUrl(data);
    if (!mediaUrl) throw new Error("No media URL found");

    const buffer = await fetchBuffer(mediaUrl);

    await sock.sendMessage(msg.key.remoteJid, {
      video: buffer,
      mimetype: "video/mp4",
      caption: "✅ Instagram media",
    }).catch(async () => {
      await sock.sendMessage(msg.key.remoteJid, {
        image: buffer,
        caption: "✅ Instagram media",
      });
    });
  } catch (err) {
    console.log("Instagram error:", err.message);
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Instagram download failed. Use a public post/reel link.",
    });
  }
}

module.exports = {
  name: "instagram",
  description: "Download Instagram media",
  execute,
};
