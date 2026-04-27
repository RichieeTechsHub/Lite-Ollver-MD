async function execute(sock, msg, args, ctx) {
  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "👑 *OWNER INFO*\n\n" +
      "Owner: RichieeTheeGoat\n" +
      "Number: wa.me/" + (ctx.OWNER_NUMBER || "254740479599")
  });
}

module.exports = { name: "owner", description: "Owner info", execute };
