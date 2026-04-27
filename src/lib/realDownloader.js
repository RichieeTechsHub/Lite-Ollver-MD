const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const yts = require("yt-search");
const ytdl = require("@distube/ytdl-core");

const TEMP_DIR = path.join(__dirname, "..", "..", "temp");

async function ensureTemp() {
  await fs.ensureDir(TEMP_DIR);
  return TEMP_DIR;
}

function isYouTubeUrl(text) {
  return /youtube\.com|youtu\.be/i.test(text);
}

async function searchYouTube(query) {
  const result = await yts(query);
  return result.videos?.[0] || null;
}

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function getTikTokNoWatermark(url) {
  const api = "https://www.tikwm.com/api/?url=" + encodeURIComponent(url);
  const { data } = await axios.get(api, { timeout: 60000 });

  if (!data?.data?.play) throw new Error("TikTok video not found");

  return {
    title: data.data.title || "TikTok Video",
    videoUrl: data.data.play,
    musicUrl: data.data.music
  };
}

async function downloadBuffer(url) {
  const res = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 120000,
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  return Buffer.from(res.data);
}

module.exports = {
  isYouTubeUrl,
  searchYouTube,
  streamToBuffer,
  getTikTokNoWatermark,
  downloadBuffer,
  ytdl,
  ensureTemp
};
