const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *antisticker*\n\nUsage: .antisticker on/off\nCurrent: " + (current["antisticker"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "antisticker", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *antisticker* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "antisticker", description: "antisticker group setting", execute };
