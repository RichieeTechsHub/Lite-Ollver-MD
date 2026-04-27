const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *antibot*\n\nUsage: .antibot on/off\nCurrent: " + (current["antibot"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "antibot", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *antibot* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "antibot", description: "antibot group setting", execute };
