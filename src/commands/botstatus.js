const os = require("os");

async function execute(sock, msg, args, ctx) {
  const uptime = process.uptime();
  const ramUsed = Math.round((os.totalmem() - os.freemem()) / 1024 / 1024);
  const ramTotal = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🤖 *BOT STATUS*\n\n" +
      "Name: " + (ctx.BOT_NAME || "Lite-Ollver-MD") + "\n" +
      "Prefix: " + (ctx.PREFIX || ".") + "\n" +
      "Uptime: " + Math.floor(uptime / 3600) + "h " + Math.floor((uptime % 3600) / 60) + "m\n" +
      "RAM: " + ramUsed + " MB / " + ramTotal + " GB\n" +
      "Mode: Public"
  });
}

module.exports = {
  name: "botstatus",
  description: "Show bot status",
  execute
};
