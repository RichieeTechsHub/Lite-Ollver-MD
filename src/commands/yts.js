const yts = require("yt-search");

async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .yts search"
    });
  }

  const res = await yts(query);
  const vids = res.videos.slice(0, 5);

  let text = "🎥 *YouTube Results*\n\n";

  vids.forEach(v => {
    text += `📌 ${v.title}\n🔗 ${v.url}\n\n`;
  });

  await sock.sendMessage(msg.key.remoteJid, { text });
}

module.exports = { name: "yts", execute };
