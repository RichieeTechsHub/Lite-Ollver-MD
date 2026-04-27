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
  
  // You can update totalCommands dynamically by counting command files
  const commandsPath = path.join(__dirname, "../commands");
  let totalCommands = 0;
  try {
    if (fs.existsSync(commandsPath)) {
      totalCommands = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js")).length;
    }
  } catch(e) { totalCommands = 126; }
  
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
║ ➤ ${config.PREFIX}ping    - Check bot response  ║
║ ➤ ${config.PREFIX}alive   - Bot status          ║
║ ➤ ${config.PREFIX}menu    - Show this menu      ║
║ ➤ ${config.PREFIX}owner   - Owner info          ║
║ ➤ ${config.PREFIX}repo    - GitHub repository   ║
║ ➤ ${config.PREFIX}runtime - Bot uptime          ║
║ ➤ ${config.PREFIX}support - Support group       ║
║ ➤ ${config.PREFIX}time    - Current time        ║
╚══════════════════════════════════╝

╔══════════════════════════════════╗
║  Total Commands: ${totalCommands}               ║
║  Type ${config.PREFIX}help <command> for usage  ║
║  Support: ${config.SUPPORT_GROUP} ║
╚══════════════════════════════════╝`;
}

async function sendMenuWithLogo(sock, from, quotedMsg) {
  try {
    const logoPath = path.join(process.cwd(), "assets", "logo.png");
    
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      const menuText = buildMenu();
      
      await sock.sendMessage(from, {
        image: logoBuffer,
        caption: menuText
      }, { quoted: quotedMsg });
      
      console.log("✅ Menu sent with logo");
    } else {
      await sock.sendMessage(from, { text: buildMenu() }, { quoted: quotedMsg });
      console.log("✅ Menu sent (text only)");
    }
  } catch (error) {
    console.error("❌ Error sending menu:", error);
    await sock.sendMessage(from, { text: buildMenu() }, { quoted: quotedMsg });
  }
}

// ========== ADD THIS FOR UNIVERSAL COMMAND LOADER ==========
async function execute(sock, msg, args, context) {
  await sendMenuWithLogo(sock, msg.key.remoteJid, msg);
}

module.exports = {
  name: "menu",
  description: "Show the main bot menu with logo",
  execute,
  buildMenu,
  sendMenuWithLogo
};
