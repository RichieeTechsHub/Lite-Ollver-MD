const fs = require("fs-extra");
const path = require("path");

const SETTINGS_FILE = path.join(__dirname, "..", "data", "bot-settings.json");

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
