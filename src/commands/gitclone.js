async function execute(sock, msg, args) {
  const repo = args[0];

  if (!repo || !repo.includes("github.com")) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .gitclone https://github.com/user/repo"
    });
  }

  try {
    const clean = repo.replace(/\/$/, "").replace(".git", "");
    const parts = clean.split("github.com/")[1].split("/");
    const owner = parts[0];
    const name = parts[1];

    const zip = `https://codeload.github.com/${owner}/${name}/zip/refs/heads/main`;

    await sock.sendMessage(msg.key.remoteJid, {
      document: { url: zip },
      fileName: `${name}.zip`,
      mimetype: "application/zip",
      caption: "✅ GitHub repo cloned as ZIP."
    });
  } catch {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Git clone failed."
    });
  }
}

module.exports = {
  name: "gitclone",
  description: "Clone GitHub repo as zip",
  execute
};
