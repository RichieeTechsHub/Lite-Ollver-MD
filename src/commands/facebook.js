const instagram = require("./instagram");

module.exports = {
  name: "facebook",
  description: "Facebook downloader fallback",
  execute: instagram.execute,
};
