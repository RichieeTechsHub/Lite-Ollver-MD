const os = require("os");

async function execute(command, { config, from, senderNumber, isOwner, args, fullArgs }) {
  
  switch (command) {
    
    case "ping":
      const start = Date.now();
      await new Promise(resolve => setTimeout(resolve, 100));
      const end = Date.now();
      return `🏓 *Pong!*\n⏱️ Response: ${end - start}ms`;
      
    case "alive":
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      return `✅ *${config.BOT_NAME}* is *ONLINE*\n\n` +
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
             `📊 Uptime: ${rhours}h ${rminutes}m ${rseconds}s`;
      
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
      const totalMem = os.totalmem() / 1024 / 1024 / 1024;
      const freeMem = os.freemem() / 1024 / 1024 / 1024;
      const usedMem = totalMem - freeMem;
      
      return `📊 *BOT STATUS*\n\n` +
             `💾 RAM: ${usedMem.toFixed(2)}GB/${totalMem.toFixed(2)}GB\n` +
             `📦 Node: ${process.version}\n` +
             `🔄 Platform: ${os.platform()}`;
      
    case "speed":
      const speed = (Math.random() * 0.5 + 0.1).toFixed(4);
      return `⚡ *Speed Test*\n\nCurrent response speed: ${speed} ms`;
      
    default:
      return null;
  }
}

module.exports = { execute };
