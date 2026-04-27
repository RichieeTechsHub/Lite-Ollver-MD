const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *allow*\n\nUsage: .allow on/off\nCurrent: " + (current["allow"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "allow", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *allow* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "allow", description: "allow group setting", execute };
