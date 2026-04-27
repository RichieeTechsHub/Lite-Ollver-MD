const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *listcode*\n\nUsage: .listcode on/off\nCurrent: " + (current["listcode"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "listcode", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *listcode* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "listcode", description: "listcode group setting", execute };
