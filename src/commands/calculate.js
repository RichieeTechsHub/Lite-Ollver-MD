async function execute(sock, msg, args) {
  const exp = args.join(" ");
  if (!exp) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .calculate 10+20*3" });

  try {
    if (!/^[0-9+\-*/().%\s]+$/.test(exp)) throw new Error("Invalid");
    const result = Function('"use strict"; return (' + exp + ')')();

    await sock.sendMessage(msg.key.remoteJid, {
      text: "🧮 *RESULT*\n\n" + exp + " = " + result
    });
  } catch {
    await sock.sendMessage(msg.key.remoteJid, { text: "❌ Invalid calculation." });
  }
}

module.exports = { name: "calculate", description: "Calculator", execute };
