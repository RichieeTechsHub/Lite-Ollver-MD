const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *editsettings*\n\nUsage: .editsettings on/off\nCurrent: " + (current["editsettings"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "editsettings", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *editsettings* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "editsettings", description: "editsettings group setting", execute };
