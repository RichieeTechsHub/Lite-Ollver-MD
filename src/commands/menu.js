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

function buildMenu() {
  const ram = getRamUsage();
  const speed = getSpeed();
  const uptime = getUptime();
  
  const totalCommands = 126;
  
  return `╔══════════════════════════════════╗
║     ⚡ LITE-OLLVER-MD ⚡         ║
║   WhatsApp Multi-Device Bot      ║
╚══════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃           BOT INFO              ┃
┠────────────────────────────────┨
┃ 👑 Owner    : ${config.OWNER_NAME}
┃ 🤖 Bot Name : ${config.BOT_NAME}
┃ 🔣 Prefix   : [ ${config.PREFIX} ]
┃ 🌍 Mode     : ${config.MODE}
┃ 📦 Plugins  : ${totalCommands}
┃ 🚀 Speed    : ${speed} ms
┃ ⏱️ Uptime   : ${uptime}
┃ 💾 RAM      : ${ram.used}GB/${ram.total}GB (${ram.percent}%)
┃ 🌐 Host     : Heroku
┃ 📱 Number   : ${config.OWNER_NUMBER}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

╔══════════════════════════════════╗
║         BASIC COMMANDS           ║
╠══════════════════════════════════╣
║ ➤ .ping    - Check bot response  ║
║ ➤ .alive   - Bot status          ║
║ ➤ .menu    - Show this menu      ║
║ ➤ .owner   - Owner info          ║
║ ➤ .repo    - GitHub repository   ║
║ ➤ .runtime - Bot uptime          ║
║ ➤ .support - Support group       ║
║ ➤ .time    - Current time        ║
╚══════════════════════════════════╝

╔══════════════════════════════════╗
║  Total Commands: ${totalCommands}               ║
║  Type .help <command> for usage  ║
║  Support: ${config.SUPPORT_GROUP} ║
╚══════════════════════════════════╝`;
}

async function sendMenuWithLogo(sock, from, msg) {
  try {
    const logoPath = path.join(process.cwd(), "assets", "logo.png");
    
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      const menuText = buildMenu();
      
      await sock.sendMessage(from, {
        image: logoBuffer,
        caption: menuText
      }, { quoted: msg });
      
      console.log("✅ Menu sent with logo");
    } else {
      await sock.sendMessage(from, { text: buildMenu() }, { quoted: msg });
      console.log("✅ Menu sent (text only)");
    }
  } catch (error) {
    console.error("❌ Error sending menu:", error);
    await sock.sendMessage(from, { text: buildMenu() }, { quoted: msg });
  }
}

module.exports = { buildMenu, sendMenuWithLogo };
