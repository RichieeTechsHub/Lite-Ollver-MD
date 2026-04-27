const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *disapproveall*\n\nUsage: .disapproveall on/off\nCurrent: " + (current["disapproveall"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "disapproveall", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *disapproveall* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "disapproveall", description: "disapproveall group setting", execute };
