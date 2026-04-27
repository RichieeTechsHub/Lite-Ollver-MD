const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(dir, { recursive: true });

const files = {
browse: `async function execute(sock, msg, args) {
  const query = args.join(" ");
  if (!query) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .browse search query" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🌐 *BROWSE*\\n\\nQuery: " + query + "\\n\\nSearch API will be connected next."
  });
}

module.exports = { name: "browse", description: "Browse/search web", execute };
`,

calculate: `async function execute(sock, msg, args) {
  const exp = args.join(" ");
  if (!exp) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .calculate 10+20*3" });

  try {
    if (!/^[0-9+\\-*/().%\\s]+$/.test(exp)) throw new Error("Invalid");
    const result = Function('"use strict"; return (' + exp + ')')();

    await sock.sendMessage(msg.key.remoteJid, {
      text: "🧮 *RESULT*\\n\\n" + exp + " = " + result
    });
  } catch {
    await sock.sendMessage(msg.key.remoteJid, { text: "❌ Invalid calculation." });
  }
}

module.exports = { name: "calculate", description: "Calculator", execute };
`,

device: `const os = require("os");

async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "📱 *DEVICE INFO*\\n\\n" +
      "Platform: " + os.platform() + "\\n" +
      "CPU: " + os.cpus()[0].model + "\\n" +
      "RAM: " + Math.round(os.totalmem()/1024/1024) + " MB"
  });
}

module.exports = { name: "device", description: "Device info", execute };
`,

emojimix: `async function execute(sock, msg, args) {
  const input = args.join(" ");
  if (!input) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .emojimix 😂+🔥" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "😀 *Emoji Mix*\\n\\nInput: " + input + "\\n\\nEmoji image API will be connected next."
  });
}

module.exports = { name: "emojimix", description: "Mix emojis", execute };
`,

fancy: `async function execute(sock, msg, args) {
  const text = args.join(" ");
  if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .fancy hello" });

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "✨ *FANCY TEXT*\\n\\n" +
      "𝙁𝘼𝙉𝘾𝙔: " + text.toUpperCase() + "\\n" +
      "𝓕𝓪𝓷𝓬𝔂: " + text + "\\n" +
      "𝗕𝗼𝗹𝗱: " + text
  });
}

module.exports = { name: "fancy", description: "Fancy text", execute };
`,

filtervcf: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "📇 *FILTER VCF*\\n\\nReply to a .vcf document. VCF filtering engine will be connected next."
  });
}

module.exports = { name: "filtervcf", description: "Filter VCF contacts", execute };
`,

fliptext: `async function execute(sock, msg, args) {
  const text = args.join(" ");
  if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .fliptext hello" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: text.split("").reverse().join("")
  });
}

module.exports = { name: "fliptext", description: "Reverse text", execute };
`,

genpass: `async function execute(sock, msg, args) {
  const len = Math.min(parseInt(args[0]) || 12, 50);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let pass = "";

  for (let i = 0; i < len; i++) pass += chars[Math.floor(Math.random() * chars.length)];

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🔐 *Generated Password*\\n\\n" + pass
  });
}

module.exports = { name: "genpass", description: "Generate password", execute };
`,

getabout: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "ℹ️ *GET ABOUT*\\n\\nWhatsApp about/status fetch will be connected next."
  });
}

module.exports = { name: "getabout", description: "Get user about", execute };
`,

getpp: `async function execute(sock, msg, args) {
  try {
    const target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || msg.key.participant || msg.key.remoteJid;
    const url = await sock.profilePictureUrl(target, "image");

    await sock.sendMessage(msg.key.remoteJid, {
      image: { url },
      caption: "🖼️ Profile Picture"
    });
  } catch {
    await sock.sendMessage(msg.key.remoteJid, { text: "❌ Failed to get profile picture." });
  }
}

module.exports = { name: "getpp", description: "Get profile picture", execute };
`,

gsmarena: `async function execute(sock, msg, args) {
  const phone = args.join(" ");
  if (!phone) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .gsmarena Samsung A13" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "📱 *GSMARENA SEARCH*\\n\\nPhone: " + phone + "\\n\\nGSMArena API will be connected next."
  });
}

module.exports = { name: "gsmarena", description: "Phone specs search", execute };
`,

obfuscate: `async function execute(sock, msg, args) {
  const code = args.join(" ");
  if (!code) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .obfuscate your code" });

  const encoded = Buffer.from(code).toString("base64");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🧩 *OBFUSCATED BASE64*\\n\\n" + encoded
  });
}

module.exports = { name: "obfuscate", description: "Obfuscate text/code", execute };
`,

qrcode: `async function execute(sock, msg, args) {
  const text = args.join(" ");
  if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .qrcode text/link" });

  const url = "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=" + encodeURIComponent(text);

  await sock.sendMessage(msg.key.remoteJid, {
    image: { url },
    caption: "✅ QR Code generated"
  });
}

module.exports = { name: "qrcode", description: "Generate QR code", execute };
`,

runeval: `async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "⚠️ Runeval is disabled for security."
  });
}

module.exports = { name: "runeval", description: "Disabled eval", execute };
`,

say: `async function execute(sock, msg, args) {
  const text = args.join(" ");
  if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .say hello" });

  await sock.sendMessage(msg.key.remoteJid, { text });
}

module.exports = { name: "say", description: "Repeat text", execute };
`,

ssweb: `async function execute(sock, msg, args) {
  const url = args[0];
  if (!url) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .ssweb https://example.com" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "📸 Screenshot request received for: " + url + "\\nScreenshot API will be connected next."
  });
}

module.exports = { name: "ssweb", description: "Website screenshot", execute };
`,

sswebpc: `async function execute(sock, msg, args) {
  const url = args[0];
  if (!url) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .sswebpc https://example.com" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🖥️ PC screenshot request received for: " + url
  });
}

module.exports = { name: "sswebpc", description: "PC website screenshot", execute };
`,

sswebtab: `async function execute(sock, msg, args) {
  const url = args[0];
  if (!url) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .sswebtab https://example.com" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "📱 Tablet screenshot request received for: " + url
  });
}

module.exports = { name: "sswebtab", description: "Tablet website screenshot", execute };
`,

sticker: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🎭 Reply to an image/video with .sticker. Sticker engine will be connected next."
  });
}

module.exports = { name: "sticker", description: "Create sticker", execute };
`,

take: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🎭 Reply to a sticker with .take packname|author. Sticker metadata engine will be connected next."
  });
}

module.exports = { name: "take", description: "Take sticker", execute };
`,

texttopdf: `async function execute(sock, msg, args) {
  const text = args.join(" ");
  if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .texttopdf your text" });

  await sock.sendMessage(msg.key.remoteJid, {
    document: Buffer.from(text),
    fileName: "Lite-Ollver-MD.txt",
    mimetype: "text/plain",
    caption: "📄 Text file created. PDF engine will be connected next."
  });
}

module.exports = { name: "texttopdf", description: "Convert text to document", execute };
`,

tinyurl: `async function execute(sock, msg, args) {
  const url = args[0];
  if (!url) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .tinyurl https://example.com" });

  try {
    const res = await fetch("https://tinyurl.com/api-create.php?url=" + encodeURIComponent(url));
    const short = await res.text();

    await sock.sendMessage(msg.key.remoteJid, {
      text: "🔗 *Short URL*\\n\\n" + short
    });
  } catch {
    await sock.sendMessage(msg.key.remoteJid, { text: "❌ Failed to shorten URL." });
  }
}

module.exports = { name: "tinyurl", description: "Shorten URL", execute };
`,

toimage: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🖼️ Reply to sticker with .toimage. Conversion engine will be connected next."
  });
}

module.exports = { name: "toimage", description: "Convert sticker to image", execute };
`,

tourl: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🔗 Reply to media with .tourl. Upload engine will be connected next."
  });
}

module.exports = { name: "tourl", description: "Upload media to URL", execute };
`,

vcc: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "📇 VCC command active. Contact conversion engine will be connected next."
  });
}

module.exports = { name: "vcc", description: "VCC contact tool", execute };
`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name + ".js"), content);
}

console.log("✅ TOOLS MENU commands injected successfully.");
