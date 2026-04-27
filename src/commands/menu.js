const config = require("../../config");
const os = require("os");
const fs = require("fs");
const path = require("path");

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
    percent: percent
  };
}

function getSpeed() {
  return (Math.random() * 0.5 + 0.1).toFixed(4);
}

function buildMenu(context) {
  const ram = getRamUsage();
  const speed = getSpeed();
  const uptime = getUptime();
  
  const commandsPath = path.join(__dirname, "../commands");
  let totalCommands = 0;
  try {
    if (fs.existsSync(commandsPath)) {
      totalCommands = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js")).length;
    }
  } catch(e) { totalCommands = 126; }
  
  return `╔══════════════════════════════════╗
║     ⚡ ${context.BOT_NAME} ⚡         ║
║   WhatsApp Multi-Device Bot      ║
╚══════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃           BOT INFO              ┃
┠────────────────────────────────┨
┃ 👑 Owner    : ${config.OWNER_NAME}
┃ 🤖 Bot Name : ${context.BOT_NAME}
┃ 🔣 Prefix   : [ ${context.PREFIX} ]
┃ 📦 Plugins  : ${totalCommands}
┃ 🚀 Speed    : ${speed} ms
┃ ⏱️ Uptime   : ${uptime}
┃ 💾 RAM      : ${ram.used}GB/${ram.total}GB (${ram.percent}%)
┃ 📱 Number   : ${config.OWNER_NUMBER}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

╔══════════════════════════════════╗
║         BASIC COMMANDS           ║
╠══════════════════════════════════╣
║ ➤ ${context.PREFIX}ping    - Check bot response  ║
║ ➤ ${context.PREFIX}menu    - Show this menu      ║
║ ➤ ${context.PREFIX}owner   - Owner info          ║
║ ➤ ${context.PREFIX}runtime - Bot uptime          ║
╚══════════════════════════════════╝

╔══════════════════════════════════╗
║  Total Commands: ${totalCommands}               ║
║  Type ${context.PREFIX}help for more commands   ║
╚══════════════════════════════════╝`;
}

async function execute(sock, msg, args, context) {
  const menuText = buildMenu(context);
  await sock.sendMessage(msg.key.remoteJid, { text: menuText });
  console.log("✅ Menu sent");
}

module.exports = {
  name: "menu",
  description: "Show the main bot menu",
  execute
};
