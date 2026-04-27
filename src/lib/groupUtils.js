const fs = require("fs-extra");
const path = require("path");

const SETTINGS_FILE = path.join(__dirname, "..", "data", "group-settings.json");

async function readSettings() {
  await fs.ensureFile(SETTINGS_FILE);
  try {
    return await fs.readJson(SETTINGS_FILE);
  } catch {
    return {};
  }
}

async function writeSettings(data) {
  await fs.writeJson(SETTINGS_FILE, data, { spaces: 2 });
}

async function getGroupSettings(jid) {
  const data = await readSettings();
  if (!data[jid]) data[jid] = {};
  return data[jid];
}

async function setGroupSetting(jid, key, value) {
  const data = await readSettings();
  if (!data[jid]) data[jid] = {};
  data[jid][key] = value;
  await writeSettings(data);
  return data[jid];
}

function isGroup(jid) {
  return jid.endsWith("@g.us");
}

async function getMetadata(sock, jid) {
  return await sock.groupMetadata(jid);
}

function getParticipantIds(metadata) {
  return metadata.participants.map(p => p.id);
}

function isAdmin(metadata, jid) {
  const user = metadata.participants.find(p => p.id === jid);
  return !!user?.admin;
}

function getSender(msg) {
  return msg.key.participant || msg.key.remoteJid;
}

function getBotJid(sock) {
  return sock.user.id.split(":")[0] + "@s.whatsapp.net";
}

async function requireGroup(sock, msg) {
  const jid = msg.key.remoteJid;
  if (!isGroup(jid)) {
    await sock.sendMessage(jid, { text: "❌ This command only works in groups." });
    return null;
  }
  return jid;
}

async function requireAdmin(sock, msg) {
  const jid = await requireGroup(sock, msg);
  if (!jid) return null;

  const metadata = await getMetadata(sock, jid);
  const sender = getSender(msg);

  if (!isAdmin(metadata, sender)) {
    await sock.sendMessage(jid, { text: "❌ Group admin only command." });
    return null;
  }

  return { jid, metadata, sender };
}

async function requireBotAdmin(sock, msg) {
  const base = await requireAdmin(sock, msg);
  if (!base) return null;

  const botJid = getBotJid(sock);
  if (!isAdmin(base.metadata, botJid)) {
    await sock.sendMessage(base.jid, { text: "❌ I need to be group admin first." });
    return null;
  }

  return base;
}

function getTarget(msg, args = []) {
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
  if (mentioned?.length) return mentioned[0];

  const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
  if (quoted) return quoted;

  const raw = args[0]?.replace(/[^0-9]/g, "");
  if (raw) return raw + "@s.whatsapp.net";

  return null;
}

module.exports = {
  getGroupSettings,
  setGroupSetting,
  requireGroup,
  requireAdmin,
  requireBotAdmin,
  getTarget,
  getParticipantIds,
};
