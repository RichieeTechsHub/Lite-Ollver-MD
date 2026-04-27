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
      text: "❌ Usage: .song song name or YouTube link"
    });
  }

  try {
    await sock.sendMessage(msg.key.remoteJid, { text: "🔎 Searching audio..." });

    const video = isYouTubeUrl(query)
      ? { url: query, title: "YouTube Audio" }
      : await searchYouTube(query);

    if (!video?.url) {
      return sock.sendMessage(msg.key.remoteJid, { text: "❌ Song not found." });
    }

    await sock.sendMessage(msg.key.remoteJid, {
      text: "🎧 Downloading audio...\n\n" + video.title
    });

    const stream = ytdl(video.url, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25
    });

    const buffer = await streamToBuffer(stream);

    await sock.sendMessage(msg.key.remoteJid, {
      audio: buffer,
      mimetype: "audio/mpeg",
      fileName: "Lite-Ollver-MD.mp3"
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Song download failed: " + err.message
    });
  }
}

module.exports = {
  name: "song",
  description: "Download YouTube audio",
  execute
};
