const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(dir, { recursive: true });

const files = {
define: `async function execute(sock, msg, args) {
  const word = args.join(" ");
  if (!word) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .define word" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "📚 *DEFINE*\\n\\nWord: " + word + "\\n\\n✅ Command active. Dictionary API will be connected next."
  });
}

module.exports = { name: "define", description: "Define a word", execute };
`,

define2: `async function execute(sock, msg, args) {
  const word = args.join(" ");
  if (!word) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .define2 word" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "📖 *DEFINE 2*\\n\\nWord: " + word + "\\n\\n✅ Alternative dictionary command active."
  });
}

module.exports = { name: "define2", description: "Alternative define command", execute };
`,

imdb: `async function execute(sock, msg, args) {
  const movie = args.join(" ");
  if (!movie) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .imdb movie name" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🎬 *IMDB SEARCH*\\n\\nMovie: " + movie + "\\n\\n✅ Movie search command active. IMDB API will be connected next."
  });
}

module.exports = { name: "imdb", description: "Search movie info", execute };
`,

lyrics: `async function execute(sock, msg, args) {
  const song = args.join(" ");
  if (!song) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .lyrics song name" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🎵 *LYRICS SEARCH*\\n\\nSong: " + song + "\\n\\n✅ Lyrics command active. Lyrics API will be connected next."
  });
}

module.exports = { name: "lyrics", description: "Search song lyrics", execute };
`,

shazam: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🎧 *SHAZAM*\\n\\nReply to an audio with .shazam\\n\\n✅ Audio recognition API will be connected next."
  });
}

module.exports = { name: "shazam", description: "Recognize song from audio", execute };
`,

weather: `async function execute(sock, msg, args) {
  const place = args.join(" ");
  if (!place) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .weather Nairobi" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🌦️ *WEATHER*\\n\\nLocation: " + place + "\\n\\n✅ Weather command active. Weather API will be connected next."
  });
}

module.exports = { name: "weather", description: "Check weather", execute };
`,

yts: `async function execute(sock, msg, args) {
  const query = args.join(" ");
  if (!query) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .yts song/video name" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "▶️ *YOUTUBE SEARCH*\\n\\nQuery: " + query + "\\n\\n✅ YouTube search command active. API will be connected next."
  });
}

module.exports = { name: "yts", description: "YouTube search", execute };
`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name + ".js"), content);
}

console.log("✅ SEARCH MENU commands injected successfully.");
