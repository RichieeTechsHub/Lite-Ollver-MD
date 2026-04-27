const { getSudoList } = require("../lib/adminAccess");

async function execute(sock, msg) {
  const sudo = await getSudoList();

  if (!sudo.length) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "📋 No sudo users added."
    });
  }

  const list = sudo.map((n, i) => `${i + 1}. +${n}`).join("\n");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "👑 *SUDO USERS*\n\n" + list
  });
}

module.exports = {
  name: "listsudo",
  description: "List sudo users",
  execute
};
