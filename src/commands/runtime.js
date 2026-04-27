function getRuntime() {
  const t = process.uptime();
  return Math.floor(t / 3600) + "h " + Math.floor((t % 3600) / 60) + "m " + Math.floor(t % 60) + "s";
}

async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "⏱️ *Runtime:* " + getRuntime()
  });
}

module.exports = {
  name: "runtime",
  description: "Show bot runtime",
  execute
};
