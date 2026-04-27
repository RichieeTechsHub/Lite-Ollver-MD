const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *closetime*\n\nUsage: .closetime on/off\nCurrent: " + (current["closetime"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "closetime", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *closetime* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "closetime", description: "closetime group setting", execute };
