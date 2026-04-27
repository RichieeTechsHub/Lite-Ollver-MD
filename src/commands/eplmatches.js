const axios = require("axios");

async function footballApi(path) {
  const key = process.env.FOOTBALL_API_KEY;

  if (!key) {
    return null;
  }

  const { data } = await axios.get("https://api.football-data.org/v4" + path, {
    headers: { "X-Auth-Token": key }
  });

  return data;
}

async function execute(sock, msg) {
  try {
    const data = await footballApi("/competitions/PL/matches?status=SCHEDULED");

    if (!data) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "⚽ EPL matches command active.\n\nFor live fixtures add FOOTBALL_API_KEY later."
      });
    }

    const matches = data.matches.slice(0, 5).map((m, i) =>
      `${i + 1}. ${m.homeTeam.name} vs ${m.awayTeam.name}\n${new Date(m.utcDate).toLocaleString()}`
    ).join("\n\n");

    await sock.sendMessage(msg.key.remoteJid, {
      text: "⚽ *Upcoming EPL Matches*\n\n" + matches
    });
  } catch {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Failed to fetch EPL matches."
    });
  }
}

module.exports = {
  name: "eplmatches",
  description: "EPL matches",
  execute
};
