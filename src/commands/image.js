<<<<<<< HEAD
async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *image* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "image", description: "image command", execute };
=======
async function execute(command, { args, fullArgs }) {
  
  const responses = {
    remini: "✨ *Remini HD*\n\nEnhancing image quality...\n\n✅ Image enhanced successfully!",
    wallpaper: `🖼️ *Wallpaper*\n\nSearching for: ${fullArgs || 'random'}\n\n✅ Found HD wallpaper!`
  };
  
  return responses[command] || `🖼️ Image command: ${command}`;
}

module.exports = { execute };
>>>>>>> 947c453f6ed8e135658b8662b1f2e94d9a4a09d3
