const yts = require("yt-search");

async function execute(sock, msg, args) {
  const query = args.join(" ").trim();

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .song song name",
    });
  }

  try {
    const search = await yts(query);
    const video = search.videos && search.videos[0];

    if (!video) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Song not found.",
      });
    }

    await sock.sendMessage(msg.key.remoteJid, {
      text:
        `🎵 *${video.title}*\n\n` +
        `⏱ ${video.timestamp}\n` +
        `👁 ${video.views}\n\n` +
        `🔗 ${video.url}`,
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Song search failed.",
    });
  }
}

module.exports = {
  name: "song",
  description: "Search song",
  execute,
};
