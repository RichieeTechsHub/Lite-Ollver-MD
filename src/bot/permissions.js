const fs = require("fs-extra");
const path = require("path");
const config = require("../../config");

const SUDO_FILE = path.join(__dirname, "..", "database", "sudo.json");

function cleanNumber(value = "") {
  return String(value).replace(/\D/g, "");
}

function jidToNumber(jid = "") {
  return cleanNumber(String(jid).split("@")[0] || "");
}

async function ensureSudoFile() {
  const exists = await fs.pathExists(SUDO_FILE);

  if (!exists) {
    await fs.writeJson(
      SUDO_FILE,
      {
        sudo: []
      },
      { spaces: 2 }
    );
  }
}

async function readSudoList() {
  await ensureSudoFile();

  try {
    const data = await fs.readJson(SUDO_FILE);
    if (!data || !Array.isArray(data.sudo)) {
      return [];
    }

    return data.sudo.map(cleanNumber).filter(Boolean);
  } catch (error) {
    console.error("Failed to read sudo list:", error.message);
    return [];
  }
}

async function writeSudoList(list = []) {
  const cleaned = [...new Set(list.map(cleanNumber).filter(Boolean))];

  await fs.writeJson(
    SUDO_FILE,
    {
      sudo: cleaned
    },
    { spaces: 2 }
  );

  return cleaned;
}

async function addSudo(number = "") {
  const cleaned = cleanNumber(number);
  if (!cleaned) {
    throw new Error("Invalid sudo number.");
  }

  const current = await readSudoList();

  if (!current.includes(cleaned)) {
    current.push(cleaned);
    await writeSudoList(current);
  }

  return current;
}

async function removeSudo(number = "") {
  const cleaned = cleanNumber(number);
  const current = await readSudoList();
  const updated = current.filter((item) => item !== cleaned);

  await writeSudoList(updated);
  return updated;
}

function isOwner(jid = "") {
  const sender = jidToNumber(jid);
  const owner = cleanNumber(config.OWNER_NUMBER);
  return sender === owner;
}

async function isSudo(jid = "") {
  if (isOwner(jid)) {
    return true;
  }

  const sender = jidToNumber(jid);
  const sudoList = await readSudoList();
  return sudoList.includes(sender);
}

function isGroup(jid = "") {
  return String(jid).endsWith("@g.us");
}

function isPrivateChat(jid = "") {
  return String(jid).endsWith("@s.whatsapp.net");
}

function isBotAdmin(groupMetadata = {}, botJid = "") {
  const participants = groupMetadata?.participants || [];
  const botNumber = jidToNumber(botJid);

  const botParticipant = participants.find(
    (participant) => jidToNumber(participant.id) === botNumber
  );

  return !!botParticipant?.admin;
}

function isAdmin(groupMetadata = {}, jid = "") {
  const participants = groupMetadata?.participants || [];
  const senderNumber = jidToNumber(jid);

  const participant = participants.find(
    (item) => jidToNumber(item.id) === senderNumber
  );

  return !!participant?.admin;
}

async function hasAccess({
  senderJid = "",
  mode = config.MODE
} = {}) {
  const currentMode = String(mode || "public").toLowerCase();

  if (currentMode === "public") {
    return true;
  }

  return isSudo(senderJid);
}

module.exports = {
  cleanNumber,
  jidToNumber,
  ensureSudoFile,
  readSudoList,
  writeSudoList,
  addSudo,
  removeSudo,
  isOwner,
  isSudo,
  isGroup,
  isPrivateChat,
  isAdmin,
  isBotAdmin,
  hasAccess
};