function extractDriveId(url) {
  const match1 = url.match(/\/d\/([^/]+)/);
  const match2 = url.match(/[?&]id=([^&]+)/);
  return match1?.[1] || match2?.[1] || null;
}

async function execute(sock, msg, args) {
  const url = args[0];

  if (!url || !url.includes("drive.google.com")) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .gdrive Google Drive public link"
    });
  }

  const id = extractDriveId(url);

  if (!id) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Could not extract Google Drive file ID."
    });
  }

  const direct = `https://drive.google.com/uc?export=download&id=${id}`;

  await sock.sendMessage(msg.key.remoteJid, {
    text: "☁️ Google Drive direct link:\n\n" + direct
  });
}

module.exports = {
  name: "gdrive",
  description: "Convert Google Drive link",
  execute
};
