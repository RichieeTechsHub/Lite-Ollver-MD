const yts = require("yt-search");
const ytdl = require("ytdl-core");

function isYouTubeUrl(text = "") {
  return /youtube\.com|youtu\.be/i.test(text);
}

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function execute(sock, msg, args) {
  const query = args.join(" ").trim();

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .video video name or YouTube link",
    });
  }

  try {
    await sock.sendMessage(msg.key.remoteJid, { text: "🔎 Searching video..." });

    let video;

    if (isYouTubeUrl(query)) {
      const info = await ytdl.getInfo(query);
      video = {
        url: query,
        title: info.videoDetails.title || "video",
        seconds: Number(info.videoDetails.lengthSeconds || 0),
      };
    } else {
      const search = await yts(query);
      video = search.videos?.[0];
    }

    if (!video?.url) {
      return sock.sendMessage(msg.key.remoteJid, { text: "❌ Video not found." });
    }

    if (video.seconds && video.seconds > 600) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Video too long. Use video under 10 minutes.",
      });
    }

    await sock.sendMessage(msg.key.remoteJid, {
      text: "🎬 Downloading video...\n\n" + video.title,
    });

    const stream = ytdl(video.url, {
      quality: "18",
      filter: "audioandvideo",
      highWaterMark: 1 << 25,
    });

    const buffer = await streamToBuffer(stream);

    await sock.sendMessage(msg.key.remoteJid, {
      video: buffer,
      mimetype: "video/mp4",
      fileName: `${String(video.title || "video").replace(/[\\/:*?"<>|]/g, "")}.mp4`,
      caption: video.title,
    });
  } catch (err) {
    console.log("Video error:", err.message);
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Video download failed. Try another video.",
    });
  }
}

module.exports = {
  name: "video",
  description: "Download YouTube video",
  execute,
};
