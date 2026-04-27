const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *antitagadmin*\n\nUsage: .antitagadmin on/off\nCurrent: " + (current["antitagadmin"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "antitagadmin", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *antitagadmin* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "antitagadmin", description: "antitagadmin group setting", execute };
