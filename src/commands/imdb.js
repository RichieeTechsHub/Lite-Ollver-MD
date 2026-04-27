const axios = require("axios");

async function execute(sock, msg, args) {
  const movie = args.join(" ");

  if (!movie) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .imdb movie name"
    });
  }

  try {
    const { data } = await axios.get(`https://www.omdbapi.com/?t=${movie}&apikey=trilogy`);

    if (data.Response === "False") {
      return sock.sendMessage(msg.key.remoteJid, { text: "❌ Movie not found." });
    }

    const text =
      `🎬 *${data.Title}*\n\n` +
      `⭐ Rating: ${data.imdbRating}\n` +
      `📅 Year: ${data.Year}\n` +
      `🎭 Genre: ${data.Genre}\n\n` +
      `${data.Plot}`;

    await sock.sendMessage(msg.key.remoteJid, { text });

  } catch {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Failed to fetch movie."
    });
  }
}

module.exports = { name: "imdb", execute };
