const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *welcome*\n\nUsage: .welcome on/off\nCurrent: " + (current["welcome"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "welcome", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *welcome* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "welcome", description: "welcome group setting", execute };
