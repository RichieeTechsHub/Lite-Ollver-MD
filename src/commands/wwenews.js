const axios = require("axios");

async function execute(sock, msg) {
  try {
    const { data } = await axios.get("https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=WWE");

    await sock.sendMessage(msg.key.remoteJid, {
      text: "🤼 *WWE News*\n\nWWE command active. News feed API will be connected later."
    });
  } catch {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "🤼 WWE news command active."
    });
  }
}

module.exports = {
  name: "wwenews",
  description: "WWE news",
  execute
};
