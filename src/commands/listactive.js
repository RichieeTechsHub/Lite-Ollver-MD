const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *listactive*\n\nUsage: .listactive on/off\nCurrent: " + (current["listactive"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "listactive", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *listactive* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "listactive", description: "listactive group setting", execute };
