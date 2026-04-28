const yts = require("yt-search");

async function execute(sock, msg, args) {
  const query = args.join(" ").trim();

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .yts search text",
    });
  }

  try {
    const search = await yts(query);
    const videos = search.videos?.slice(0, 10) || [];

    if (!videos.length) {
      return sock.sendMessage(msg.key.remoteJid, { text: "❌ No results found." });
    }

    const text = videos
      .map((v, i) =>
        `${i + 1}. *${v.title}*\n⏱ ${v.timestamp}\n🔗 ${v.url}`
      )
      .join("\n\n");

    await sock.sendMessage(msg.key.remoteJid, {
      text: "🔎 *YouTube Search Results*\n\n" + text,
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ YouTube search failed.",
    });
  }
}

module.exports = {
  name: "yts",
  description: "Search YouTube",
  execute,
};
