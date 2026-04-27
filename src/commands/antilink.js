const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *antilink*\n\nUsage: .antilink on/off\nCurrent: " + (current["antilink"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "antilink", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *antilink* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "antilink", description: "antilink group setting", execute };
