const { searchYouTube, isYouTubeUrl, ytdl } = require("../lib/youtubeClient");

async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .video video name or YouTube link"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, { text: "🔎 Searching video..." });

  try {
    const video = isYouTubeUrl(query) ? { url: query, title: "YouTube Video" } : await searchYouTube(query);

    if (!video?.url) {
      return sock.sendMessage(msg.key.remoteJid, { text: "❌ Video not found." });
    }

    await sock.sendMessage(msg.key.remoteJid, {
      text:
        "🎥 *Downloading Video...*\n\n" +
        "Title: " + video.title + "\n" +
        "URL: " + video.url
    });

    const stream = ytdl(video.url, {
      filter: "audioandvideo",
      quality: "18"
    });

    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    await sock.sendMessage(msg.key.remoteJid, {
      video: buffer,
      mimetype: "video/mp4",
      caption: video.title || "Video"
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
