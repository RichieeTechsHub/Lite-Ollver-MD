const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(dir, { recursive: true });

const files = {
remini: `const { downloadMediaMessage } = require("@whiskeysockets/baileys");

async function execute(sock, msg) {
  try {
    const quotedInfo = msg.message?.extendedTextMessage?.contextInfo;
    const quoted = quotedInfo?.quotedMessage;

    if (!quoted?.imageMessage) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Reply to an image with .remini"
      });
    }

    const quotedMsg = {
      key: {
        remoteJid: msg.key.remoteJid,
        id: quotedInfo.stanzaId,
        participant: quotedInfo.participant
      },
      message: quoted
    };

    const buffer = await downloadMediaMessage(
      quotedMsg,
      "buffer",
      {},
      { logger: console, reuploadRequest: sock.updateMediaMessage }
    );

    await sock.sendMessage(msg.key.remoteJid, {
      image: buffer,
      caption: "✨ Image received. Remini enhancement API will be connected next."
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Remini failed. Reply to a valid image."
    });
  }
}

module.exports = {
  name: "remini",
  description: "Enhance replied image",
  execute
};
`,

wallpaper: `async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .wallpaper cars"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🖼️ *Wallpaper Search*\\n\\n" +
      "Query: " + query + "\\n\\n" +
      "✅ Command is working. Wallpaper API will be connected next."
  });
}

module.exports = {
  name: "wallpaper",
  description: "Search wallpaper",
  execute
};
`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name + ".js"), content);
}

console.log("✅ IMAGE MENU commands injected successfully.");
