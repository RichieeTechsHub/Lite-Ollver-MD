const fs = require("fs");
const path = require("path");
const config = require("../../config");

const SETTINGS_FILE = path.join(process.cwd(), "settings.json");

// Load settings
function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }
  return {};
}

// Save settings
function saveSettings(settings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving settings:", error);
    return false;
  }
}

async function execute(command, { args, fullArgs }) {
  let settings = loadSettings();
  let response = "";
  
  switch (command) {
    case "getsettings":
      response = `⚙️ *CURRENT SETTINGS*\n\n` +
                 `🤖 Bot Name: ${settings.botName || config.BOT_NAME}\n` +
                 `👑 Owner: ${settings.ownerName || config.OWNER_NAME}\n` +
                 `📱 Owner Number: ${settings.ownerNumber || config.OWNER_NUMBER}\n` +
                 `🔣 Prefix: ${settings.prefix || config.PREFIX}\n` +
                 `🌍 Mode: ${settings.mode || config.MODE}\n` +
                 `⏰ Timezone: ${settings.timezone || config.TIMEZONE}\n` +
                 `💬 Chatbot: ${settings.chatbot ? "✅ ON" : "❌ OFF"}\n` +
                 `⌨️ AutoTyping: ${settings.autotyping ? "✅ ON" : "❌ OFF"}\n` +
                 `🎙️ AutoRecording: ${settings.autorecording ? "✅ ON" : "❌ OFF"}\n` +
                 `👁️ AutoReadStatus: ${settings.autoreadstatus ? "✅ ON" : "❌ OFF"}\n` +
                 `❤️ AutoReactStatus: ${settings.autoreactstatus ? "✅ ON" : "❌ OFF"}\n` +
                 `✨ Status Emoji: ${settings.statusEmoji || config.STATUS_EMOJI}\n` +
                 `⏱️ Status Delay: ${settings.statusDelay || config.STATUS_DELAY}s`;
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
      if (args[0].length > 2) return "❌ Prefix must be 1-2 characters";
      settings.prefix = args[0];
      saveSettings(settings);
      response = `✅ Prefix updated to: *${args[0]}*`;
      break;
      
    case "setbotname":
      if (!fullArgs) return "❌ Usage: .setbotname New Bot Name";
      settings.botName = fullArgs;
      saveSettings(settings);
      response = `✅ Bot name updated to: *${fullArgs}*`;
      break;
      
    case "setownername":
      if (!fullArgs) return "❌ Usage: .setownername New Owner Name";
      settings.ownerName = fullArgs;
      saveSettings(settings);
      response = `✅ Owner name updated to: *${fullArgs}*`;
      break;
      
    case "setownernumber":
      if (!args[0]) return "❌ Usage: .setownernumber 254700000000";
      const cleanNum = args[0].replace(/\D/g, "");
      if (cleanNum.length < 10) return "❌ Invalid number format";
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
      
    case "setstatusemoji":
      if (!args[0]) return "❌ Usage: .setstatusemoji 😂";
      settings.statusEmoji = args[0];
      saveSettings(settings);
      response = `✅ Status emoji updated to: *${args[0]}*`;
      break;
      
    case "statusdelay":
      if (!args[0]) return `Current delay: ${settings.statusDelay || config.STATUS_DELAY}s\nUsage: .statusdelay 10`;
      const delay = parseInt(args[0]);
      if (isNaN(delay) || delay < 1) return "❌ Delay must be a number greater than 0";
      settings.statusDelay = delay;
      saveSettings(settings);
      response = `✅ Status delay updated to: *${delay}s*`;
      break;
      
    case "autotyping":
      if (!args[0]) return `AutoTyping: ${settings.autotyping ? "✅ ON" : "❌ OFF"}\nUsage: .autotyping on/off`;
      const typing = args[0] === "on";
      settings.autotyping = typing;
      saveSettings(settings);
      response = `✅ AutoTyping turned *${args[0]}*`;
      break;
      
    case "autorecording":
      if (!args[0]) return `AutoRecording: ${settings.autorecording ? "✅ ON" : "❌ OFF"}\nUsage: .autorecording on/off`;
      const recording = args[0] === "on";
      settings.autorecording = recording;
      saveSettings(settings);
      response = `✅ AutoRecording turned *${args[0]}*`;
      break;
      
    case "autoreadstatus":
      if (!args[0]) return `AutoReadStatus: ${settings.autoreadstatus ? "✅ ON" : "❌ OFF"}\nUsage: .autoreadstatus on/off`;
      const read = args[0] === "on";
      settings.autoreadstatus = read;
      saveSettings(settings);
      response = `✅ AutoReadStatus turned *${args[0]}*`;
      break;
      
    case "autoreactstatus":
      if (!args[0]) return `AutoReactStatus: ${settings.autoreactstatus ? "✅ ON" : "❌ OFF"}\nUsage: .autoreactstatus on/off`;
      const react = args[0] === "on";
      settings.autoreactstatus = react;
      saveSettings(settings);
      response = `✅ AutoReactStatus turned *${args[0]}*`;
      break;
      
    case "chatbot":
      if (!args[0]) return `Chatbot: ${settings.chatbot ? "✅ ON" : "❌ OFF"}\nUsage: .chatbot on/off`;
      const chatbot = args[0] === "on";
      settings.chatbot = chatbot;
      saveSettings(settings);
      response = `✅ Chatbot turned *${args[0]}*`;
      break;
      
    case "statussettings":
      response = `📊 *STATUS SETTINGS*\n\n` +
                 `👁️ AutoRead: ${settings.autoreadstatus ? "✅ ON" : "❌ OFF"}\n` +
                 `❤️ AutoReact: ${settings.autoreactstatus ? "✅ ON" : "❌ OFF"}\n` +
                 `✨ Emoji: ${settings.statusEmoji || config.STATUS_EMOJI}\n` +
                 `⏱️ Delay: ${settings.statusDelay || config.STATUS_DELAY}s`;
      break;
      
    default:
      return null;
  }
  
  return response;
}

module.exports = { execute };