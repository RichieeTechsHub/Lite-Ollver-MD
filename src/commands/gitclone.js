async function execute(sock, msg, args) {
  const url = args[0];

  if (!url || !url.includes("github.com")) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .gitclone GitHub-repo-link",
    });
  }

  try {
    const clean = url.replace(/\/$/, "");
    const parts = clean.split("github.com/")[1]?.split("/");

    if (!parts || parts.length < 2) throw new Error("Invalid GitHub URL");

    const owner = parts[0];
    const repo = parts[1].replace(".git", "");
    const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/main.zip`;

    await sock.sendMessage(msg.key.remoteJid, {
      document: { url: zipUrl },
      fileName: `${repo}.zip`,
      mimetype: "application/zip",
      caption: `✅ GitHub repo cloned\n${owner}/${repo}`,
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Git clone failed. Make sure the repo is public and has main branch.",
    });
  }
}

module.exports = {
  name: "gitclone",
  description: "Download GitHub repo zip",
  execute,
};
