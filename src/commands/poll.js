async function execute(sock, msg, args) {
  const text = args.join(" ");
  if (!text.includes("|")) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .poll Question | Option 1 | Option 2"
    });
  }

  const parts = text.split("|").map(x => x.trim()).filter(Boolean);
  const name = parts.shift();
  const values = parts;

  await sock.sendMessage(msg.key.remoteJid, {
    poll: { name, values, selectableCount: 1 }
  });
}

module.exports = { name: "poll", description: "Create poll", execute };
