const axios = require("axios");
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

async function downloadWithApi(url) {
  const apiUrl = "https://api.agatz.xyz/api/ytmp3?url=" + encodeURIComponent(url);
  const { data } = await axios.get(apiUrl, { timeout: 90000 });

  const audioUrl =
    data?.data?.downloadUrl ||
    data?.data?.url ||
    data?.result?.downloadUrl ||
    data?.result?.url ||
    data?.downloadUrl ||
    data?.url;

  if (!audioUrl) throw new Error("API did not return audio link");

  const audio = await axios.get(audioUrl, {
    responseType: "arraybuffer",
    timeout: 120000,
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  return Buffer.from(audio.data);
}

async function downloadWithYtdl(url) {
  const stream = ytdl(url, {
    filter: "audioonly",
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  });

  return streamToBuffer(stream);
}

async function execute(sock, msg, args) {
  const query = args.join(" ").trim();

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .song song name or YouTube link",
    });
  }

  try {
    await sock.sendMessage(msg.key.remoteJid, { text: "🔎 Searching song..." });

    let video;

    if (isYouTubeUrl(query)) {
      const info = await ytdl.getInfo(query).catch(() => null);
      video = {
        url: query,
        title: info?.videoDetails?.title || "song",
        seconds: Number(info?.videoDetails?.lengthSeconds || 0),
      };
    } else {
      const search = await yts(query);
      video = search.videos?.[0];
    }

    if (!video?.url) {
      return sock.sendMessage(msg.key.remoteJid, { text: "❌ Song not found." });
    }

    if (video.seconds && video.seconds > 900) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Song too long. Use audio under 15 minutes.",
      });
    }

    await sock.sendMessage(msg.key.remoteJid, {
      text: "🎧 Downloading audio...\n\n" + video.title,
    });

    let buffer;

    try {
      buffer = await downloadWithApi(video.url);
    } catch (apiErr) {
      console.log("Song API failed:", apiErr.message);
      buffer = await downloadWithYtdl(video.url);
    }

    await sock.sendMessage(msg.key.remoteJid, {
      audio: buffer,
      mimetype: "audio/mpeg",
      fileName: `${String(video.title || "song").replace(/[\\/:*?"<>|]/g, "")}.mp3`,
    });
  } catch (err) {
    console.log("Song error:", err.message);
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Song audio download failed. Try another song.",
    });
  }
}

module.exports = {
  name: "song",
  description: "Download song audio",
  execute,
};
