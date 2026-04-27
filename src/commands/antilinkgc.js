const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *antilinkgc*\n\nUsage: .antilinkgc on/off\nCurrent: " + (current["antilinkgc"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "antilinkgc", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *antilinkgc* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "antilinkgc", description: "antilinkgc group setting", execute };
