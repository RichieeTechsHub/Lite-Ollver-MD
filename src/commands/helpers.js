async function execute(sock, msg, args, ctx) {
  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🆘 *SUPPORT HELPERS*\n\n" +
      "👑 Owner: wa.me/" + (ctx.OWNER_NUMBER || "254740479599") + "\n" +
      "📌 Use .feedback your message to report issues.\n" +
      "🤖 Bot: " + (ctx.BOT_NAME || "Lite-Ollver-MD")
  });
}

module.exports = {
  name: "helpers",
  description: "Show support helpers",
  execute
};
