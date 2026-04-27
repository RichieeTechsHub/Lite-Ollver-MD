const fs = require("fs");
const path = require("path");
const config = require("../../config");

const SETTINGS_FILE = path.join(process.cwd(), "settings.json");

function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
    }
  } catch (error) {}
  return {};
}

function saveSettings(settings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    return false;
  }
}

async function execute(command, { args, fullArgs, config }) {
  
  let settings = loadSettings();
  let response = "";
  
  switch (command) {
    
    case "getsettings":
      response = `⚙️ *CURRENT SETTINGS*\n\n` +
                 `🤖 Bot Name: ${settings.botName || config.BOT_NAME}\n` +
                 `👑 Owner: ${settings.ownerName || config.OWNER_NAME}\n` +
                 `📱 Number: ${settings.ownerNumber || config.OWNER_NUMBER}\n` +
                 `🔣 Prefix: ${settings.prefix || config.PREFIX}\n` +
                 `🌍 Mode: ${settings.mode || config.MODE}\n` +
                 `⏰ Timezone: ${settings.timezone || config.TIMEZONE}`;
      break;
    
    case "mode":
      if (!args[0]) return `Current mode: ${settings.mode || config.MODE}\nUsage: .mode public/private`;
      if (!["public", "private"].includes(args[0])) return "❌ Mode must be 'public' or 'private'";
      settings.mode = args[0];
      saveSettings(settings);
      response = `✅ Mode updated to: *${args[0]}*`;
      break;
    
    case "setprefix":
      if (!args[0]) return "❌ Usage: .setprefix !";
      settings.prefix = args[0];
      saveSettings(settings);
      response = `✅ Prefix updated to: *${args[0]}*`;
      break;
    
    case "setbotname":
      if (!fullArgs) return "❌ Usage: .setbotname New Name";
      settings.botName = fullArgs;
      saveSettings(settings);
      response = `✅ Bot name updated to: *${fullArgs}*`;
      break;
    
    case "setownername":
      if (!fullArgs) return "❌ Usage: .setownername New Name";
      settings.ownerName = fullArgs;
      saveSettings(settings);
      response = `✅ Owner name updated to: *${fullArgs}*`;
      break;
    
    case "setownernumber":
      if (!args[0]) return "❌ Usage: .setownernumber 254700000000";
      const cleanNum = args[0].replace(/\D/g, "");
      settings.ownerNumber = cleanNum;
      saveSettings(settings);
      response = `✅ Owner number updated to: *${cleanNum}*`;
      break;
    
    case "settimezone":
      if (!args[0]) return "❌ Usage: .settimezone Africa/Nairobi";
      settings.timezone = args[0];
      saveSettings(settings);
      response = `✅ Timezone updated to: *${args[0]}*`;
      break;
    
    default:
      return null;
  }
  
  return response;
}

module.exports = { execute };
