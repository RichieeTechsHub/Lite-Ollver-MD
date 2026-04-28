const tiktok = require("./tiktok");

module.exports = {
  name: "tiktokaudio",
  description: "TikTok audio fallback",
  execute: tiktok.execute,
};
