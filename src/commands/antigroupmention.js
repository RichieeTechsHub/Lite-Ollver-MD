const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *antigroupmention*\n\nUsage: .antigroupmention on/off\nCurrent: " + (current["antigroupmention"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "antigroupmention", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *antigroupmention* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "antigroupmention", description: "antigroupmention group setting", execute };
