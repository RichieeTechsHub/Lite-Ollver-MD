async function execute(sock, msg) {
  try {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Reply to a view-once message with .vv",
      });
    }

    const viewOnce =
      quoted.viewOnceMessage?.message ||
      quoted.viewOnceMessageV2?.message ||
      quoted.viewOnceMessageV2Extension?.message;

    if (!viewOnce) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ That is not a view-once message.",
      });
    }

    await sock.sendMessage(msg.key.remoteJid, viewOnce);
  } catch (err) {
    console.log("VV error:", err.message);

    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Failed to open view-once.",
    });
  }
}

module.exports = {
  name: "vv",
  description: "Open view-once message manually",
  execute,
};
