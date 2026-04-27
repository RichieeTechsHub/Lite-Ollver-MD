const {
  isYouTubeUrl,
  searchYouTube,
  streamToBuffer,
  ytdl
} = require("../lib/realDownloader");

async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .video video name or YouTube link"
    });
  }

  try {
    await sock.sendMessage(msg.key.remoteJid, { text: "🔎 Searching video..." });

    const video = isYouTubeUrl(query)
      ? { url: query, title: "YouTube Video" }
      : await searchYouTube(query);

    if (!video?.url) {
      return sock.sendMessage(msg.key.remoteJid, { text: "❌ Video not found." });
    }

    await sock.sendMessage(msg.key.remoteJid, {
      text: "🎥 Downloading video...\n\n" + video.title
    });

    const stream = ytdl(video.url, {
      filter: "audioandvideo",
      quality: "18",
      highWaterMark: 1 << 25
    });

    const buffer = await streamToBuffer(stream);

    await sock.sendMessage(msg.key.remoteJid, {
      video: buffer,
      mimetype: "video/mp4",
      caption: video.title || "Lite-Ollver-MD Video"
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Video download failed: " + err.message
    });
  }
}

module.exports = {
  name: "video",
  description: "Download YouTube video",
  execute
};
