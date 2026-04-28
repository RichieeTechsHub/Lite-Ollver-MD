const instagram = require("./instagram");

module.exports = {
  name: "twitter",
  description: "Twitter/X downloader fallback",
  execute: instagram.execute,
};
