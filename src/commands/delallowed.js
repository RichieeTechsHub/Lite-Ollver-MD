const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *delallowed*\n\nUsage: .delallowed on/off\nCurrent: " + (current["delallowed"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "delallowed", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *delallowed* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "delallowed", description: "delallowed group setting", execute };
