const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(dir, { recursive: true });

const commands = [
  "apk","download","facebook","gdrive","gitclone","image","instagram",
  "itunes","mediafire","pin","savestatus","song","song2","telesticker",
  "tiktok","tiktokaudio","twitter","video","videodoc","xvideo"
];

const templates = {
  apk: {
    text: "📦 APK search received. Send app name after .apk",
    usage: ".apk whatsapp"
  },
  download: {
    text: "⬇️ Download command active. Send a direct URL after .download",
    usage: ".download https://example.com/file.zip"
  },
  facebook: {
    text: "📘 Facebook downloader ready. Send Facebook video URL.",
    usage: ".facebook <facebook video link>"
  },
  gdrive: {
    text: "☁️ Google Drive downloader ready. Send public Google Drive link.",
    usage: ".gdrive <drive link>"
  },
  gitclone: {
    text: "🐙 Git clone helper ready. Send GitHub repo URL.",
    usage: ".gitclone https://github.com/user/repo"
  },
  image: {
    text: "🖼️ Image search command ready. Send search term.",
    usage: ".image lion wallpaper"
  },
  instagram: {
    text: "📸 Instagram downloader ready. Send Instagram URL.",
    usage: ".instagram <instagram link>"
  },
  itunes: {
    text: "🎵 iTunes search ready. Send song/artist name.",
    usage: ".itunes burna boy"
  },
  mediafire: {
    text: "🔥 MediaFire downloader ready. Send MediaFire link.",
    usage: ".mediafire <mediafire link>"
  },
  pin: {
    text: "📌 Pinterest search ready. Send search term.",
    usage: ".pin cars"
  },
  savestatus: {
    text: "💾 Reply to a status/media message to save it.",
    usage: ".savestatus"
  },
  song: {
    text: "🎧 Song search ready. Send song name.",
    usage: ".song calm down rema"
  },
  song2: {
    text: "🎧 Alternative song search ready. Send song name.",
    usage: ".song2 calm down rema"
  },
  telesticker: {
    text: "📦 Telegram sticker downloader ready. Send sticker pack URL.",
    usage: ".telesticker <telegram sticker url>"
  },
  tiktok: {
    text: "🎬 TikTok downloader ready. Send TikTok URL.",
    usage: ".tiktok <tiktok link>"
  },
  tiktokaudio: {
    text: "🎵 TikTok audio downloader ready. Send TikTok URL.",
    usage: ".tiktokaudio <tiktok link>"
  },
  twitter: {
    text: "𝕏 Twitter/X downloader ready. Send tweet/video URL.",
    usage: ".twitter <x/twitter link>"
  },
  video: {
    text: "🎥 Video search ready. Send video name or link.",
    usage: ".video funny cats"
  },
  videodoc: {
    text: "📄 Video document mode ready. Send video URL.",
    usage: ".videodoc <video link>"
  },
  xvideo: {
    text: "🎥 XVideo command disabled for safety.",
    usage: ".xvideo disabled"
  }
};

function makeCommand(name) {
  const data = templates[name];

  return `async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "${name}" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: ${data.usage}"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "${data.text}\\n\\n" +
      (input ? "📌 Input: " + input + "\\n\\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "${name}",
  description: "${data.text}",
  execute
};
`;
}

for (const name of commands) {
  fs.writeFileSync(path.join(dir, name + ".js"), makeCommand(name));
}

console.log("✅ DOWNLOAD MENU commands injected successfully.");
