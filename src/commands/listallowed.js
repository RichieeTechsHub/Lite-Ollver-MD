const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *listallowed*\n\nUsage: .listallowed on/off\nCurrent: " + (current["listallowed"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "listallowed", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *listallowed* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "listallowed", description: "listallowed group setting", execute };
