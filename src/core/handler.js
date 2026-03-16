const config = require("../../config");
const { buildMenu, sendMenuWithLogo } = require("../commands/menu");

// Import all command modules
const otherCmd = require("../commands/other");
const aiCmd = require("../commands/ai");
const audioCmd = require("../commands/audio");
const downloadCmd = require("../commands/download");
const funCmd = require("../commands/fun");
const gamesCmd = require("../commands/games");
const groupCmd = require("../commands/group");
const imageCmd = require("../commands/image");
const ownerCmd = require("../commands/owner");
const religionCmd = require("../commands/religion");
const searchCmd = require("../commands/search");
const settingsCmd = require("../commands/settings");
const supportCmd = require("../commands/support");
const toolsCmd = require("../commands/tools");
const translateCmd = require("../commands/translate");
const videoCmd = require("../commands/video");

async function handleMessages(sock, msg) {
  try {
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || from;
    const isGroup = from.endsWith("@g.us");
    const senderNumber = sender.split("@")[0];
    const isOwner = senderNumber === config.OWNER_NUMBER;
    
    // Extract text from message
    const text = msg.message.conversation || 
                 msg.message.extendedTextMessage?.text || 
                 msg.message.imageMessage?.caption || 
                 msg.message.videoMessage?.caption || 
                 "";
    
    if (!text) return;
    
    console.log(`📨 [${new Date().toLocaleTimeString()}] From: ${senderNumber} - "${text}"`);
    
    // Check if it's a command
    if (!text.startsWith(config.PREFIX)) {
      console.log(`❌ Not a command (prefix: ${config.PREFIX})`);
      return;
    }
    
    const args = text.slice(config.PREFIX.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();
    const fullArgs = args.join(" ");
    
    console.log(`⚡ Command detected: .${command}`);
    
    // Check mode
    if (config.MODE === "private" && !isOwner && !isGroup) {
      await sock.sendMessage(from, { 
        text: "🔒 Bot is in *private mode*. Only owner can use commands." 
      });
      return;
    }
    
    let response = null;
    
    // Route commands
    switch(command) {
      case "menu":
      case "help":
      case "commands":
        await sendMenuWithLogo(sock, from, msg);
        return;
      
      case "ping":
        const start = Date.now();
        await sock.sendMessage(from, { text: "⚡ Pinging..." });
        const end = Date.now();
        response = `🏓 *Pong!*\n⏱️ Response: ${end - start}ms`;
        break;
      
      case "alive":
        response = `✅ *${config.BOT_NAME}* is *ONLINE*\n\n👑 Owner: ${config.OWNER_NAME}\n🔣 Prefix: ${config.PREFIX}`;
        break;
      
      case "owner":
        response = `👑 *Owner*\n📛 ${config.OWNER_NAME}\n📱 ${config.OWNER_NUMBER}`;
        break;
      
      case "repo":
        response = `📦 *Repository*\n🔗 https://github.com/RichieeTechsHub/Lite-Ollver-MD`;
        break;
      
      case "runtime":
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        response = `⏱️ *Uptime*\n${hours}h ${minutes}m ${seconds}s`;
        break;
      
      case "support":
        response = `💬 *Support*\n👥 ${config.SUPPORT_GROUP}`;
        break;
      
      case "time":
        response = `⏰ *Time*\n${new Date().toLocaleString()}`;
        break;
      
      // Add other commands here
      
      default:
        console.log(`❓ Unknown command: ${command}`);
        await sock.sendMessage(from, { 
          text: `❌ Unknown command: *${command}*\nType .menu to see available commands.` 
        }, { quoted: msg });
        return;
    }
    
    if (response) {
      await sock.sendMessage(from, { text: response }, { quoted: msg });
      console.log(`✅ Response sent for: ${command}`);
    }
    
  } catch (error) {
    console.error("❌ Handler error:", error);
  }
}

module.exports = { handleMessages };
