const config = require("../../config");
const os = require("os");
const { exec } = require("child_process");

async function execute(command, { sock, from, senderNumber, isOwner, args, fullArgs }) {
  switch (command) {
    case "ping":
      const start = Date.now();
      await sock.sendMessage(from, { text: "⚡ *Pinging...*" });
      const end = Date.now();
      return `🏓 *Pong!*\n⏱️ Response: ${end - start}ms`;
      
    case "alive":
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      return `✅ *${config.BOT_NAME}* is *ONLINE*\n\n` +
             `🤖 Bot: ${config.BOT_NAME} v${config.VERSION}\n` +
             `👑 Owner: ${config.OWNER_NAME}\n` +
             `🔣 Prefix: ${config.PREFIX}\n` +
             `🌍 Mode: ${config.MODE}\n` +
             `⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s`;
      
    case "owner":
      return `👑 *OWNER INFORMATION*\n\n` +
             `📛 Name: ${config.OWNER_NAME}\n` +
             `📱 Number: ${config.OWNER_NUMBER}\n` +
             `🔗 Contact: wa.me/${config.OWNER_NUMBER}`;
      
    case "repo":
      return `📦 *REPOSITORY*\n\n` +
             `🔗 https://github.com/RichieeTechsHub/Lite-Ollver-MD\n` +
             `⭐ Star this repo if you like it!`;
      
    case "runtime":
      const runtime = process.uptime();
      const rhours = Math.floor(runtime / 3600);
      const rminutes = Math.floor((runtime % 3600) / 60);
      const rseconds = Math.floor(runtime % 60);
      return `⏱️ *RUNTIME*\n\n` +
             `📊 Uptime: ${rhours}h ${rminutes}m ${rseconds}s\n` +
             `📅 Started: ${new Date(Date.now() - runtime * 1000).toLocaleString()}`;
      
    case "support":
      return `💬 *SUPPORT*\n\n` +
             `👥 Group: ${config.SUPPORT_GROUP}\n` +
             `📞 Owner: wa.me/${config.OWNER_NUMBER}`;
      
    case "time":
      return `⏰ *TIME*\n\n` +
             `📅 Date: ${new Date().toLocaleDateString()}\n` +
             `⏱️ Time: ${new Date().toLocaleTimeString()}\n` +
             `🌍 Timezone: ${config.TIMEZONE}`;
      
    case "botstatus":
      const totalMem = os.totalmem() / 1024 / 1024;
      const freeMem = os.freemem() / 1024 / 1024;
      const usedMem = totalMem - freeMem;
      const cpuUsage = os.loadavg()[0].toFixed(2);
      
      return `📊 *BOT STATUS*\n\n` +
             `💾 RAM: ${usedMem.toFixed(0)}MB/${totalMem.toFixed(0)}MB\n` +
             `⚙️ CPU: ${cpuUsage}%\n` +
             `🖥️ Platform: ${os.platform()}\n` +
             `⏱️ Uptime: ${rhours}h ${rminutes}m ${rseconds}s`;
      
    default:
      return null;
  }
}

module.exports = { execute };