const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(dir, { recursive: true });

const files = {
botstatus: `const os = require("os");

async function execute(sock, msg, args, ctx) {
  const uptime = process.uptime();
  const ramUsed = Math.round((os.totalmem() - os.freemem()) / 1024 / 1024);
  const ramTotal = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🤖 *BOT STATUS*\\n\\n" +
      "Name: " + (ctx.BOT_NAME || "Lite-Ollver-MD") + "\\n" +
      "Prefix: " + (ctx.PREFIX || ".") + "\\n" +
      "Uptime: " + Math.floor(uptime / 3600) + "h " + Math.floor((uptime % 3600) / 60) + "m\\n" +
      "RAM: " + ramUsed + " MB / " + ramTotal + " GB\\n" +
      "Mode: Public"
  });
}

module.exports = {
  name: "botstatus",
  description: "Show bot status",
  execute
};
`,

pair: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🔐 *PAIR INFO*\\n\\n" +
      "This bot is already connected using SESSION_ID.\\n" +
      "To pair a new number, use your session generator site."
  });
}

module.exports = {
  name: "pair",
  description: "Pairing information",
  execute
};
`,

ping: `async function execute(sock, msg) {
  const start = Date.now();

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🏓 Pong!\\n⚡ Speed: " + (Date.now() - start) + " ms"
  });
}

module.exports = {
  name: "ping",
  description: "Check bot response",
  execute
};
`,

ping2: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🏓 Pong 2! Bot is alive."
  });
}

module.exports = {
  name: "ping2",
  description: "Second ping command",
  execute
};
`,

repo: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "📦 *LITE-OLLVER-MD REPO*\\n\\n" +
      "GitHub: https://github.com/RichieeTechsHub/Lite-Ollver-MD"
  });
}

module.exports = {
  name: "repo",
  description: "Show bot repo",
  execute
};
`,

runtime: `function getRuntime() {
  const t = process.uptime();
  return Math.floor(t / 3600) + "h " + Math.floor((t % 3600) / 60) + "m " + Math.floor(t % 60) + "s";
}

async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "⏱️ *Runtime:* " + getRuntime()
  });
}

module.exports = {
  name: "runtime",
  description: "Show bot runtime",
  execute
};
`,

time: `async function execute(sock, msg) {
  const now = new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🕒 *Kenya Time:* " + now
  });
}

module.exports = {
  name: "time",
  description: "Show Kenya time",
  execute
};
`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name + ".js"), content);
}

console.log("✅ OTHER MENU commands injected successfully.");
