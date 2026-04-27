const axios = require("axios");

async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .apk whatsapp"
    });
  }

  try {
    const url = "https://ws75.aptoide.com/api/7/apps/search/query=" + encodeURIComponent(query) + "/limit=1";
    const { data } = await axios.get(url);

    const app = data?.datalist?.list?.[0];

    if (!app) {
      return sock.sendMessage(msg.key.remoteJid, { text: "❌ APK not found." });
    }

    await sock.sendMessage(msg.key.remoteJid, {
      text:
        "📦 *APK FOUND*\n\n" +
        "Name: " + app.name + "\n" +
        "Package: " + app.package + "\n" +
        "Version: " + app.file?.vername + "\n\n" +
        "Download:\n" + app.file?.path
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ APK search failed."
    });
  }
}

module.exports = {
  name: "apk",
  description: "Search APK",
  execute
};
