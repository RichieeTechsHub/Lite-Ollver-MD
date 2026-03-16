async function execute(command, { args, fullArgs }) {
  const responses = {
    toaudio: "🎵 *Video to Audio*\nThis feature is coming soon!",
    toimage: "🖼️ *Video to Image*\nThis feature is coming soon!",
    tovideo: "🎬 *Image to Video*\nThis feature is coming soon!"
  };
  
  return responses[command] || `❌ ${command} command not implemented yet`;
}

module.exports = { execute };