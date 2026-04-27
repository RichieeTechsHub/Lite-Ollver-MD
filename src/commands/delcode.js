const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *delcode*\n\nUsage: .delcode on/off\nCurrent: " + (current["delcode"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "delcode", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *delcode* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "delcode", description: "delcode group setting", execute };
