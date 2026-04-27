const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *antiforeign*\n\nUsage: .antiforeign on/off\nCurrent: " + (current["antiforeign"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "antiforeign", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *antiforeign* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "antiforeign", description: "antiforeign group setting", execute };
