const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *listrequests*\n\nUsage: .listrequests on/off\nCurrent: " + (current["listrequests"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "listrequests", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *listrequests* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "listrequests", description: "listrequests group setting", execute };
