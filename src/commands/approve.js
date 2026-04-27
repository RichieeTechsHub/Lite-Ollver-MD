const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *approve*\n\nUsage: .approve on/off\nCurrent: " + (current["approve"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "approve", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *approve* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "approve", description: "approve group setting", execute };
