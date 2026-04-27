const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *kickinactive*\n\nUsage: .kickinactive on/off\nCurrent: " + (current["kickinactive"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "kickinactive", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *kickinactive* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "kickinactive", description: "kickinactive group setting", execute };
