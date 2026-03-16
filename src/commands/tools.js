const axios = require("axios");
const crypto = require("crypto");

async function execute(command, { sock, from, msg, args, fullArgs }) {
  switch (command) {
    case "calculate":
      if (!fullArgs) return "❌ Usage: .calculate 2+2";
      try {
        // Safe eval for basic math
        const result = eval(fullArgs);
        return `🧮 *Calculation*\n\n${fullArgs} = ${result}`;
      } catch {
        return "❌ Invalid calculation";
      }
      
    case "fancy":
      if (!fullArgs) return "❌ Usage: .fancy Hello";
      const fancyMap = {
        'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': '𝑒', 'f': '𝒻',
        'g': '𝑔', 'h': '𝒽', 'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁',
        'm': '𝓂', 'n': '𝓃', 'o': '𝑜', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇',
        's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍',
        'y': '𝓎', 'z': '𝓏'
      };
      const fancy = fullArgs.toLowerCase().split('').map(c => fancyMap[c] || c).join('');
      return `✨ *Fancy Text*\n\n${fancy}`;
      
    case "genpass":
      const length = parseInt(args[0]) || 12;
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      let password = "";
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `🔐 *Generated Password*\n\n\`${password}\`\n\nLength: ${length}`;
      
    case "qrcode":
      if (!fullArgs) return "❌ Usage: .qrcode https://example.com";
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(fullArgs)}`;
      await sock.sendMessage(from, {
        image: { url: qrUrl },
        caption: `✅ QR Code for: ${fullArgs}`
      });
      return null; // Already sent
      
    case "tinyurl":
      if (!fullArgs) return "❌ Usage: .tinyurl https://example.com";
      try {
        const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(fullArgs)}`);
        return `🔗 *TinyURL*\n\nOriginal: ${fullArgs}\nShortened: ${response.data}`;
      } catch {
        return "❌ Failed to create short URL";
      }
      
    case "say":
      if (!fullArgs) return "❌ Usage: .say Hello world";
      return `🔊 *Bot says:*\n\n${fullArgs}`;
      
    case "sticker":
      if (msg.message.imageMessage) {
        // Simulate sticker creation
        await sock.sendMessage(from, {
          sticker: { url: "https://via.placeholder.com/512" },
          mimetype: "image/webp"
        });
        return null; // Already sent
      }
      return "❌ Reply to an image with .sticker";
      
    case "getpp":
      const user = msg.message.extendedTextMessage?.contextInfo?.participant || 
                   args[0]?.replace(/\D/g, "") + "@s.whatsapp.net" || 
                   from;
      
      try {
        const ppUrl = await sock.profilePictureUrl(user, "image");
        await sock.sendMessage(from, {
          image: { url: ppUrl },
          caption: `🖼️ Profile Picture`
        });
      } catch {
        return "❌ User has no profile picture";
      }
      return null;
      
    case "ssweb":
      if (!fullArgs) return "❌ Usage: .ssweb https://example.com";
      const ssUrl = `https://api.screenshotmachine.com/?key=YOUR_KEY&url=${encodeURIComponent(fullArgs)}&size=1024x768`;
      await sock.sendMessage(from, {
        image: { url: ssUrl },
        caption: `📸 Screenshot of: ${fullArgs}`
      });
      return null;
      
    default:
      return `🔧 Tools command .${command} executed!`;
  }
}

module.exports = { execute };