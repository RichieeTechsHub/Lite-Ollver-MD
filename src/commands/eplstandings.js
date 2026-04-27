const axios = require("axios");

async function execute(sock, msg) {
  const key = process.env.FOOTBALL_API_KEY;

  if (!key) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "🏆 EPL standings command active.\n\nAdd FOOTBALL_API_KEY later for live standings."
    });
  }

  try {
    const { data } = await axios.get("https://api.football-data.org/v4/competitions/PL/standings", {
      headers: { "X-Auth-Token": key }
    });

    const table = data.standings[0].table.slice(0, 10).map(row =>
      `${row.position}. ${row.team.name} - ${row.points} pts`
    ).join("\n");

    await sock.sendMessage(msg.key.remoteJid, {
      text: "🏆 *EPL Standings Top 10*\n\n" + table
    });
  } catch {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Failed to fetch standings."
    });
  }
}

module.exports = {
  name: "eplstandings",
  description: "EPL standings",
  execute
};
