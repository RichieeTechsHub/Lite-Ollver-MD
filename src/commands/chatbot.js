const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *chatbot*\n\nUsage: .chatbot on/off\nCurrent: " + (settings["chatbot"] ? "ON" : "OFF")
    });
  }

  await setSetting("chatbot", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *chatbot* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "chatbot",
  description: "chatbot toggle command",
  execute
};
