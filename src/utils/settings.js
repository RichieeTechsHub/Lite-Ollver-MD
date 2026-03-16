const fs = require("fs");
const path = require("path");

const SETTINGS_FILE = path.join(process.cwd(), "settings.json");

async function getSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading settings:", error);
  }
  return {};
}

async function updateSetting(key, value) {
  try {
    const settings = await getSettings();
    settings[key] = value;
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null