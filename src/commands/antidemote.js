const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *antidemote*\n\nUsage: .antidemote on/off\nCurrent: " + (current["antidemote"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "antidemote", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *antidemote* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "antidemote", description: "antidemote group setting", execute };
