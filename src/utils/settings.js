const fs = require("fs-extra");
const path = require("path");
const config = require("../../config");

const SETTINGS_PATH = path.join(__dirname, "..", "database", "settings.json");

const defaultSettings = {
  botName: config.BOT_NAME || "Lite-Ollver-MD",
  ownerName: config.OWNER_NAME || "RichiieeTheeGoat",
  ownerNumber: config.OWNER_NUMBER || "254740479599",
  mode: config.MODE || "public",
  prefix: config.PREFIX || ".",
  timezone: config.TIMEZONE || "Africa/Nairobi",
  autotyping: Boolean(config.AUTOTYPING),
  autorecording: Boolean(config.AUTORECORDING),
  autoreadstatus: Boolean(config.AUTOREAD_STATUS),
  autoreactstatus: Boolean(config.AUTOREACT_STATUS),
  statusEmoji: config.STATUS_EMOJI || "✅",
  statusDelay: Number(config.STATUS_DELAY || 5),
  chatbot: false,
  menuImage: "",
  supportGroup: config.SUPPORT_GROUP || "",
  ownerContact: config.OWNER_CONTACT || ""
};

async function ensureSettingsFile() {
  await fs.ensureFile(SETTINGS_PATH);

  const exists = await fs.pathExists(SETTINGS_PATH);
  if (!exists) {
    await fs.writeJson(SETTINGS_PATH, defaultSettings, { spaces: 2 });
    return;
  }

  let data = {};
  try {
    data = await fs.readJson(SETTINGS_PATH);
  } catch {
    data = {};
  }

  const merged = { ...defaultSettings, ...data };
  await fs.writeJson(SETTINGS_PATH, merged, { spaces: 2 });
}

async function getSettings() {
  await ensureSettingsFile();

  try {
    const data = await fs.readJson(SETTINGS_PATH);
    return { ...defaultSettings, ...data };
  } catch {
    await fs.writeJson(SETTINGS_PATH, defaultSettings, { spaces: 2 });
    return { ...defaultSettings };
  }
}

async function saveSettings(newSettings) {
  const current = await getSettings();
  const merged = { ...current, ...newSettings };
  await fs.writeJson(SETTINGS_PATH, merged, { spaces: 2 });
  return merged;
}

async function updateSetting(key, value) {
  const current = await getSettings();
  current[key] = value;
  await fs.writeJson(SETTINGS_PATH, current, { spaces: 2 });
  return current;
}

function parseToggle(value = "") {
  const v = String(value).toLowerCase().trim();

  if (["on", "enable", "enabled", "true", "yes", "1"].includes(v)) return true;
  if (["off", "disable", "disabled", "false", "no", "0"].includes(v)) return false;

  return null;
}

function formatBool(value) {
  return value ? "ON" : "OFF";
}

function cleanNumber(value = "") {
  return String(value).replace(/\D/g, "");
}

module.exports = {
  SETTINGS_PATH,
  defaultSettings,
  ensureSettingsFile,
  getSettings,
  saveSettings,
  updateSetting,
  parseToggle,
  formatBool,
  cleanNumber
};