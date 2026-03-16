const config = require("../../config");

async function handleMessages(sock, msg) {
  try {
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || from;
    const senderNumber = sender.split("@")[0];
    
    const text = msg.message.conversation || 
                 msg.message.extendedTextMessage?.text || 
                 "";
    
    if (!text || !text.startsWith(config.PREFIX)) return;
    
    const cmd = text.slice(config.PREFIX.length).trim().split(" ")[0].toLowerCase();
    const args = text.slice(config.PREFIX.length + cmd.length).trim();
    
    console.log(`📨 Command: ${cmd} from ${senderNumber}`);
    
    let response = "";
    
    switch(cmd) {
      case "ping":
        response = "🏓 Pong!";
        break;
        
      case "menu":
        response = `╭━━━〔 ${config.BOT_NAME} 〕━━━╮
┃ 👑 Owner: ${config.OWNER_NAME}
┃ 🔣 Prefix: ${config.PREFIX}
┃ 🌍 Mode: ${config.MODE}
╰━━━━━━━━━━━━━━━━╯

📋 Commands:
• ${config.PREFIX}ping
• ${config.PREFIX}menu
• ${config.PREFIX}owner
• ${config.PREFIX}alive`;
        break;
        
      case "owner":
        response = `👑 *Owner*\n📛 ${config.OWNER_NAME}\n📱 ${config.OWNER_NUMBER}`;
        break;
        
      case "alive":
        response = `✅ ${config.BOT_NAME} is online!`;
        break;
        
      default:
        return;
    }
    
    if (response) {
      await sock.sendMessage(from, { text: response }, { quoted: msg });
      console.log(`✅ Response sent for: ${cmd}`);
    }
    
  } catch (error) {
    console.error("❌ Handler error:", error);
  }
}

module.exports = { handleMessages };
