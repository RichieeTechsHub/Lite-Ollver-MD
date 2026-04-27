const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *approveall*\n\nUsage: .approveall on/off\nCurrent: " + (current["approveall"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "approveall", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *approveall* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "approveall", description: "approveall group setting", execute };
