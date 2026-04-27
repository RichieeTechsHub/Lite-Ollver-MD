const { getSudoList, cleanNumber } = require("../lib/adminAccess");

async function execute(sock, msg, args, ctx) {
  const sender = cleanNumber(msg.key.participant || msg.key.remoteJid);
  const owner = cleanNumber(ctx.OWNER_NUMBER);
  const sudo = await getSudoList();

  const isAdmin = sender === owner || sudo.includes(sender);

  if (!isAdmin) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Owner/sudo only command."
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "╭─❍ *OWNER PANEL*\n" +
      "│ .mode public/private\n" +
      "│ .setprefix .\n" +
      "│ .addsudo 2547xxxxxxx\n" +
      "│ .delsudo 2547xxxxxxx\n" +
      "│ .listsudo\n" +
      "│ .restart\n" +
      "│ .update\n" +
      "│ .alwaysonline on/off\n" +
      "│ .autoviewstatus on/off\n" +
      "╰━━━━━━━━━━━━"
  });
}

module.exports = {
  name: "ownerpanel",
  description: "Show owner control panel",
  execute
};
