const axios = require("axios");

async function fetchJson(url) {
  const res = await axios.get(url, {
    timeout: 30000,
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });
  return res.data;
}

function needUrl(name) {
  return `❌ Usage: .${name} <link or search text>`;
}

module.exports = {
  fetchJson,
  needUrl
};
