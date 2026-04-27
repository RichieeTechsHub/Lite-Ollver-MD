const { readSettings, writeSettings } = require("./botSettings");

function cleanNumber(value = "") {
  return String(value).replace(/\D/g, "");
}

async function getSudoList() {
  const settings = await readSettings();
  return Array.isArray(settings.sudo) ? settings.sudo : [];
}

async function addSudo(number) {
  const clean = cleanNumber(number);
  const settings = await readSettings();

  if (!Array.isArray(settings.sudo)) settings.sudo = [];

  if (!settings.sudo.includes(clean)) {
    settings.sudo.push(clean);
  }

  await writeSettings(settings);
  return settings.sudo;
}

async function removeSudo(number) {
  const clean = cleanNumber(number);
  const settings = await readSettings();

  settings.sudo = Array.isArray(settings.sudo)
    ? settings.sudo.filter((n) => n !== clean)
    : [];

  await writeSettings(settings);
  return settings.sudo;
}

function isOwnerOrSudo(sender, ownerNumber, sudoList = []) {
  const cleanSender = cleanNumber(sender);
  const cleanOwner = cleanNumber(ownerNumber);

  return cleanSender === cleanOwner || sudoList.includes(cleanSender);
}

module.exports = {
  cleanNumber,
  getSudoList,
  addSudo,
  removeSudo,
  isOwnerOrSudo,
};
