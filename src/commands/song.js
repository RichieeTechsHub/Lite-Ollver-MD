const yts = require("yt-search");
const ytdl = require("@distube/ytdl-core");

function isYouTubeUrl(text) {
  return /youtube\.com|youtu\.be/i.test(text);
}

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .song song name or YouTube link",
    });
  }

  try {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "🔎 Searching song...",
    });

    let video;

    if (isYouTubeUrl(query)) {
      const info = await ytdl.getInfo(query);
      video = {
        url: query,
        title: info.videoDetails.title,
        seconds: Number(info.videoDetails.lengthSeconds || 0),
      };
    } else {
      const search = await yts(query);
      video = search.videos?.[0];
    }

    if (!video?.url) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Song not found.",
      });
    }

    if (video.seconds && video.seconds > 900) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Song too long. Use audio under 15 minutes.",
      });
    }

    await sock.sendMessage(msg.key.remoteJid, {
      text: `🎧 Downloading audio...\n\n${video.title}`,
    });

    const stream = ytdl(video.url, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25,
    });

    const buffer = await streamToBuffer(stream);

    await sock.sendMessage(msg.key.remoteJid, {
      audio: buffer,
      mimetype: "audio/mpeg",
      fileName: `${video.title || "song"}.mp3`,
    });
  } catch (err) {
    console.log("Song error:", err.message);
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Song download failed. Try another song or YouTube link.",
    });
  }
}

module.exports = {
  name: "song",
  description: "Download song as audio",
  execute,
};