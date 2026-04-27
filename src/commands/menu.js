const os = require("os");
const fs = require("fs");
const path = require("path");

function safeConfig() {
  try {
    return require("../../config");
  } catch {
    return {};
  }
}

const config = safeConfig();

function getUptime() {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
}

function getRamUsage() {
  const total = os.totalmem() / 1024 / 1024 / 1024;
  const free = os.freemem() / 1024 / 1024 / 1024;
  const used = total - free;
  const percent = ((used / total) * 100).toFixed(1);

  return {
    used: used.toFixed(1),
    total: total.toFixed(1),
    percent,
  };
}

function getSpeed() {
  return (Math.random() * 0.5 + 0.1).toFixed(4);
}

function countCommands() {
  const commandsPath = path.join(__dirname);

  try {
    if (!fs.existsSync(commandsPath)) return 0;

    return fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js")).length;
  } catch {
    return 0;
  }
}

function buildMenu(context) {
  const ram = getRamUsage();
  const speed = getSpeed();
  const uptime = getUptime();

  const totalCommands = context.COMMANDS_COUNT || countCommands();
  const ownerName = config.OWNER_NAME || "RichieeTheeGoat";
  const ownerNumber = config.OWNER_NUMBER || context.OWNER_NUMBER || "254740479599";

  return `╔══════════════════════════════════╗
║       ⚡ ${context.BOT_NAME} ⚡
║     WhatsApp Multi-Device Bot
╚══════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃            BOT INFO
┠────────────────────────────────┨
┃ 👑 Owner   : ${ownerName}
┃ 🤖 Bot     : ${context.BOT_NAME}
┃ 🔣 Prefix  : ${context.PREFIX}
┃ 📦 Plugins : ${totalCommands}
┃ 🚀 Speed   : ${speed} ms
┃ ⏱️ Uptime  : ${uptime}
┃ 💾 RAM     : ${ram.used}GB/${ram.total}GB (${ram.percent}%)
┃ 📱 Number  : ${ownerNumber}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

╔══════════════════════════════════╗
║          BASIC COMMANDS
╠══════════════════════════════════╣
║ ➤ ${context.PREFIX}ping
║ ➤ ${context.PREFIX}menu
║ ➤ ${context.PREFIX}owner
║ ➤ ${context.PREFIX}runtime
╚══════════════════════════════════╝

📌 Total Commands: ${totalCommands}
💡 Type *${context.PREFIX}help* for more commands.`;
}

async function execute(sock, msg, args, context) {
  const menuText = buildMenu(context);

  await sock.sendMessage(msg.key.remoteJid, {
    text: menuText,
  });

  console.log("✅ Menu sent");
}

module.exports = {
  name: "menu",
  description: "Show the main bot menu",
  execute,
};
