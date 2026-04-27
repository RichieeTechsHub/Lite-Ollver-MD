const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *announcements*\n\nUsage: .announcements on/off\nCurrent: " + (current["announcements"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "announcements", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *announcements* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "announcements", description: "announcements group setting", execute };
