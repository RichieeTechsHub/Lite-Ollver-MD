async function execute(command, { sock, from, msg, args, fullArgs }) {
  
  switch (command) {
    
    case "calculate":
      if (!fullArgs) return "❌ Usage: .calculate 2+2";
      try {
        const result = eval(fullArgs);
        return `🧮 *RESULT*\n\n${fullArgs} = ${result}`;
      } catch {
        return "❌ Invalid calculation";
      }
    
    case "fancy":
      if (!fullArgs) return "❌ Usage: .fancy Hello";
      const fancy = fullArgs.split('').map(c => {
        const map = { 'a':'𝒶','b':'𝒷','c':'𝒸','d':'𝒹','e':'𝑒','f':'𝒻',
                     'g':'𝑔','h':'𝒽','i':'𝒾','j':'𝒿','k':'𝓀','l':'𝓁',
                     'm':'𝓂','n':'𝓃','o':'𝑜','p':'𝓅','q':'𝓆','r':'𝓇',
                     's':'𝓈','t':'𝓉','u':'𝓊','v':'𝓋','w':'𝓌','x':'𝓍',
                     'y':'𝓎','z':'𝓏' };
        return map[c.toLowerCase()] || c;
      }).join('');
      return `✨ *FANCY TEXT*\n\n${fancy}`;
    
    case "genpass":
      const length = parseInt(args[0]) || 12;
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      let password = "";
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `🔐 *PASSWORD*\n\n\`${password}\`\n\nLength: ${length}`;
    
    case "qrcode":
      if (!fullArgs) return "❌ Usage: .qrcode https://example.com";
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(fullArgs)}`;
      await sock.sendMessage(from, {
        image: { url: qrUrl },
        caption: `✅ QR Code for: ${fullArgs}`
      }, { quoted: msg });
      return null;
    
    case "tinyurl":
      if (!fullArgs) return "❌ Usage: .tinyurl https://example.com";
      return `🔗 *SHORT URL*\n\nOriginal: ${fullArgs}\nShort: tinyurl.com/example`;
    
    case "say":
      if (!fullArgs) return "❌ Usage: .say Hello";
      return `🔊 *BOT SAYS*\n\n"${fullArgs}"`;
    
    case "sticker":
      return "🖼️ *STICKER*\n\nReply to an image with .sticker to create a sticker!";
    
    default:
      return null;
  }
}

module.exports = { execute };
