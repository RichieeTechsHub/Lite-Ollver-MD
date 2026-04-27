const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(dir, { recursive: true });

const files = {
translate: `async function execute(sock, msg, args) {
  const text = args.join(" ");

  if (!text) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .translate hello to swahili"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🌍 *TRANSLATE*\\n\\n" +
      "Input: " + text + "\\n\\n" +
      "✅ Translate command active. Translation API will be connected next."
  });
}

module.exports = {
  name: "translate",
  description: "Translate text",
  execute
};
`,

toaudio: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🎧 Reply to a video with .toaudio. Video-to-audio engine will be connected next."
  });
}

module.exports = {
  name: "toaudio",
  description: "Convert video to audio",
  execute
};
`,

tovideo: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🎥 Reply to a sticker/GIF/audio with .tovideo. Video conversion engine will be connected next."
  });
}

module.exports = {
  name: "tovideo",
  description: "Convert media to video",
  execute
};
`,

volvideo: `async function execute(sock, msg, args) {
  const level = args[0] || "2";

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🔊 *VIDEO VOLUME*\\n\\n" +
      "Volume level: " + level + "x\\n\\n" +
      "Reply to a video with .volvideo 2. FFmpeg video audio-volume engine will be connected next."
  });
}

module.exports = {
  name: "volvideo",
  description: "Increase video volume",
  execute
};
`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name + ".js"), content);
}

console.log("✅ TRANSLATE + VIDEO MENU commands injected successfully.");
