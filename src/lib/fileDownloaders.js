const axios = require("axios");
const cheerio = require("cheerio");

async function mediafire(url) {
  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const $ = cheerio.load(data);
  const link = $("#downloadButton").attr("href");

  if (!link) throw new Error("Download link not found");

  return link;
}

module.exports = { mediafire };
