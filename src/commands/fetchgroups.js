async function execute(sock, msg) {
  try {
    const groups = await sock.groupFetchAllParticipating();
    const list = Object.values(groups);

    if (!list.length) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Bot is not in any groups."
      });
    }

    const text = list.map((g, i) =>
      (i + 1) + ". " + g.subject + "\nID: " + g.id + "\nMembers: " + (g.participants?.length || 0)
    ).join("\n\n");

    await sock.sendMessage(msg.key.remoteJid, {
      text: "👥 *GROUPS FETCHED*\n\n" + text
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Failed to fetch groups."
    });
  }
}

module.exports = {
  name: "fetchgroups",
  description: "Fetch all groups where bot is present",
  execute
};
