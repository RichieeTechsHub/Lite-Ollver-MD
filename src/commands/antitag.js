const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *antitag*\n\nUsage: .antitag on/off\nCurrent: " + (current["antitag"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "antitag", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *antitag* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "antitag", description: "antitag group setting", execute };
