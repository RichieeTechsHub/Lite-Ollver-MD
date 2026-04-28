const fs = require("fs-extra");
const path = require("path");

const SETTINGS_FILE = path.join(__dirname, "..", "data", "bot-settings.json");

// 🔥 DEFAULT SETTINGS (VERY IMPORTANT)
const DEFAULT_SETTINGS = {
  mode: "public",
  prefix: ".",
  ownerNumber: process.env.OWNER_NUMBER || "254740479599",
  sudo: [],
  autoviewstatus: false,
  autoreactstatus: false,
  alwaysonline: false,
  antidelete: false
};

async function readSettings() {
  await fs.ensureFile(SETTINGS_FILE);

  try {
    const data = await fs.readJson(SETTINGS_FILE);

    // 🔥 Merge with defaults (prevents undefined issues)
    return { ...DEFAULT_SETTINGS, ...data };
  } catch {
    // 🔥 If file is broken → reset to defaults
    await writeSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
}

async function writeSettings(data) {
  const merged = { ...DEFAULT_SETTINGS, ...data };
  await fs.writeJson(SETTINGS_FILE, merged, { spaces: 2 });
}

async function setSetting(key, value) {
  const data = await readSettings();
  data[key] = value;
  await writeSettings(data);
  return data;
}

module.exports = {
  readSettings,
  writeSettings,
  setSetting
};
