async function execute(sock, msg, args, ctx) {
  const feedback = args.join(" ");

  if (!feedback) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .feedback your message"
    });
  }

  const owner = (ctx.OWNER_NUMBER || "254740479599") + "@s.whatsapp.net";

  await sock.sendMessage(owner, {
    text:
      "📩 *NEW FEEDBACK*\n\n" +
      "From: " + (msg.key.participant || msg.key.remoteJid) + "\n\n" +
      feedback
  });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ Feedback sent to the owner."
  });
}

module.exports = {
  name: "feedback",
  description: "Send feedback to owner",
  execute
};
