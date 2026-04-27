const { mediafire } = require("../lib/fileDownloaders");

async function execute(sock, msg, args) {
  const url = args[0];

  if (!url || !url.includes("mediafire.com")) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .mediafire MediaFire link"
    });
  }

  try {
    await sock.sendMessage(msg.key.remoteJid, { text: "🔥 Fetching MediaFire file..." });

    const direct = await mediafire(url);

    await sock.sendMessage(msg.key.remoteJid, {
      text: "✅ MediaFire direct link:\n\n" + direct
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ MediaFire failed: " + err.message
    });
  }
}

module.exports = {
  name: "mediafire",
  description: "Get MediaFire direct link",
  execute
};
