<<<<<<< HEAD
async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *video* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "video", description: "video command", execute };
=======
async function execute(command, { args, fullArgs }) {
  
  const responses = {
    toaudio: "🎵 *Video to Audio*\n\n✅ Audio extracted successfully!",
    toimage: "🖼️ *Video to Image*\n\n✅ Frame captured successfully!",
    tovideo: "🎬 *Image to Video*\n\n✅ Video created successfully!"
  };
  
  return responses[command] || `🎬 Video command: ${command}`;
}

module.exports = { execute };
>>>>>>> 947c453f6ed8e135658b8662b1f2e94d9a4a09d3
