const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *cancelkick*\n\nUsage: .cancelkick on/off\nCurrent: " + (current["cancelkick"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "cancelkick", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *cancelkick* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "cancelkick", description: "cancelkick group setting", execute };
