const yts = require("yt-search");
const ytdl = require("@distube/ytdl-core");

async function searchYouTube(query) {
  const result = await yts(query);
  return result.videos?.[0] || null;
}

async function getYouTubeInfo(url) {
  return await ytdl.getInfo(url);
}

function isYouTubeUrl(text) {
  return /youtube\\.com|youtu\\.be/.test(text);
}

module.exports = {
  searchYouTube,
  getYouTubeInfo,
  isYouTubeUrl,
  ytdl
};
