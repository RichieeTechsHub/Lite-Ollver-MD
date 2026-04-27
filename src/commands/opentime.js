const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *opentime*\n\nUsage: .opentime on/off\nCurrent: " + (current["opentime"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "opentime", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *opentime* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "opentime", description: "opentime group setting", execute };
