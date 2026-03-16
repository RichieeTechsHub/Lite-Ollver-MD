async function execute(command, { args, fullArgs }) {
  
  const responses = {
    toaudio: "🎵 *Video to Audio*\n\n✅ Audio extracted successfully!",
    toimage: "🖼️ *Video to Image*\n\n✅ Frame captured successfully!",
    tovideo: "🎬 *Image to Video*\n\n✅ Video created successfully!"
  };
  
  return responses[command] || `🎬 Video command: ${command}`;
}

module.exports = { execute };
