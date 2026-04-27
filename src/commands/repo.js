const GITHUB_REPO =
  process.env.GITHUB_REPO_URL ||
  "https://github.com/RichieeTechsHub/Lite-Ollver-MD";

const HEROKU_DEPLOY =
  process.env.HEROKU_DEPLOY_URL ||
  "https://heroku.com/deploy?template=https://github.com/RichieeTechsHub/Lite-Ollver-MD";

const SESSION_SITE =
  process.env.SESSION_SITE_URL ||
  "https://lite-ollver-session.onrender.com";

async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "╭━━━〔 *LITE-OLLVER-MD LINKS* 〕━━━╮\n" +
      "│\n" +
      "│ 🚀 *Heroku Deploy Button:*\n" +
      "│ " + HEROKU_DEPLOY + "\n" +
      "│\n" +
      "│ 📦 *GitHub Repo:*\n" +
      "│ " + GITHUB_REPO + "\n" +
      "│\n" +
      "│ 🔐 *Session Generator:*\n" +
      "│ " + SESSION_SITE + "\n" +
      "│\n" +
      "╰━━━━━━━━━━━━━━━━━━━━━━━╯"
  });
}

module.exports = {
  name: "repo",
  description: "Show deployment, GitHub, and session links",
  execute,
};
