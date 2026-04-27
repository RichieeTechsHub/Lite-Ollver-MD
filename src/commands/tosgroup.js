async function execute(sock, msg, args) {
  const jid = msg.key.remoteJid;

  if (!jid.endsWith("@g.us")) {
    return sock.sendMessage(jid, {
      text: "❌ This command only works inside a group."
    });
  }

  const text = args.join(" ");

  if (!text) {
    return sock.sendMessage(jid, {
      text: "❌ Usage: .tosgroup your message here"
    });
  }

  await sock.sendMessage(jid, {
    text: "📢 *GROUP STATUS MESSAGE*\n\n" + text
  });
}

module.exports = {
  name: "tosgroup",
  description: "Send text as group status-style message",
  execute
};
