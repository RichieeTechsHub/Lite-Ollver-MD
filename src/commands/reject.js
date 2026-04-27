const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *reject*\n\nUsage: .reject on/off\nCurrent: " + (current["reject"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "reject", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *reject* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "reject", description: "reject group setting", execute };
