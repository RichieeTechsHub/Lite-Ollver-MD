const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *listinactive*\n\nUsage: .listinactive on/off\nCurrent: " + (current["listinactive"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "listinactive", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *listinactive* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "listinactive", description: "listinactive group setting", execute };
