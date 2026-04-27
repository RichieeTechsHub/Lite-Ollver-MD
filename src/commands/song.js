const { searchYouTube, isYouTubeUrl, ytdl } = require("../lib/youtubeClient");

async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .song song name or YouTube link"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, { text: "🔎 Searching song..." });

  try {
    const video = isYouTubeUrl(query) ? { url: query, title: "YouTube Audio" } : await searchYouTube(query);

    if (!video?.url) {
      return sock.sendMessage(msg.key.remoteJid, { text: "❌ Song not found." });
    }

    await sock.sendMessage(msg.key.remoteJid, {
      text:
        "🎧 *Downloading Audio...*\n\n" +
        "Title: " + video.title + "\n" +
        "URL: " + video.url
    });

    const stream = ytdl(video.url, {
      filter: "audioonly",
      quality: "highestaudio"
    });

    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    await sock.sendMessage(msg.key.remoteJid, {
      audio: buffer,
      mimetype: "audio/mpeg",
      fileName: (video.title || "song") + ".mp3"
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Song download failed: " + err.message
    });
  }
}

module.exports = {
  name: "song",
  description: "Download YouTube song",
  execute
};
