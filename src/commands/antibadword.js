const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *antibadword*\n\nUsage: .antibadword on/off\nCurrent: " + (current["antibadword"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "antibadword", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *antibadword* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "antibadword", description: "antibadword group setting", execute };
