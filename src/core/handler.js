const config = require("../../config");

// Import all command modules (injection points)
const menuCmd = require("../commands/menu");
const aiCmd = require("../commands/ai");
const audioCmd = require("../commands/audio");
const downloadCmd = require("../commands/download");
const funCmd = require("../commands/fun");
const gamesCmd = require("../commands/games");
const groupCmd = require("../commands/group");
const imageCmd = require("../commands/image");
const otherCmd = require("../commands/other");
const ownerCmd = require("../commands/owner");
const religionCmd = require("../commands/religion");
const searchCmd = require("../commands/search");
const settingsCmd = require("../commands/settings");
const supportCmd = require("../commands/support");
const toolsCmd = require("../commands/tools");
const translateCmd = require("../commands/translate");
const videoCmd = require("../commands/video");

async function handleMessages(sock, msg) {
  try {
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || from;
    const isGroup = from.endsWith("@g.us");
    const senderNumber = sender.split("@")[0];
    const isOwner = senderNumber === config.OWNER_NUMBER;
    
    const text = msg.message.conversation || 
                 msg.message.extendedTextMessage?.text || 
                 msg.message.imageMessage?.caption || 
                 "";
    
    if (!text || !text.startsWith(config.PREFIX)) return;
    
    const args = text.slice(config.PREFIX.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();
    const fullArgs = args.join(" ");
    
    console.log(`📨 [${new Date().toLocaleTimeString()}] .${command} from ${senderNumber}`);
    
    // Command routing - INJECT COMMANDS HERE
    let response = null;
    
    switch (command) {
      // Menu commands
      case "menu":
      case "help":
        response = menuCmd.execute(config);
        break;
        
      // Other basic commands
      case "ping":
      case "alive":
      case "owner":
      case "repo":
      case "runtime":
      case "support":
      case "time":
        response = await otherCmd.execute(command, { config, from, senderNumber, isOwner, args, fullArgs });
        break;
        
      // AI commands
      case "analyze":
      case "blackbox":
      case "code":
      case "generate":
      case "gpt":
      case "programming":
      case "recipe":
      case "story":
      case "summarize":
      case "teach":
        response = await aiCmd.execute(command, { config, args, fullArgs });
        break;
        
      // Audio commands
      case "bass":
      case "deep":
      case "reverse":
      case "robot":
      case "tomp3":
      case "toptt":
      case "volaudio":
        response = await audioCmd.execute(command, { config, args, fullArgs });
        break;
        
      // Download commands
      case "apk":
      case "facebook":
      case "gdrive":
      case "gitclone":
      case "image":
      case "instagram":
      case "mediafire":
      case "song":
      case "tiktok":
      case "twitter":
      case "video":
        response = await downloadCmd.execute(command, { config, args, fullArgs });
        break;
        
      // Fun commands
      case "fact":
      case "jokes":
      case "memes":
      case "quotes":
      case "trivia":
        response = await funCmd.execute(command, { config });
        break;
        
      // Games commands
      case "dare":
      case "truth":
      case "truthordare":
        response = await gamesCmd.execute(command, { config });
        break;
        
      // Group commands
      case "add":
      case "antilink":
      case "close":
      case "demote":
      case "goodbye":
      case "hidetag":
      case "invite":
      case "kick":
      case "link":
      case "open":
      case "poll":
      case "promote":
      case "resetlink":
      case "setdesc":
      case "setgoodbye":
      case "setgroupname":
      case "setwelcome":
      case "showgoodbye":
      case "showwelcome":
      case "tagadmin":
      case "tagall":
      case "testgoodbye":
      case "testwelcome":
      case "totalmembers":
      case "welcome":
        if (!isGroup) response = "❌ This command only works in groups!";
        else response = await groupCmd.execute(command, { sock, from, msg, args, fullArgs, isOwner });
        break;
        
      // Image commands
      case "remini":
      case "wallpaper":
        response = await imageCmd.execute(command, { config, args, fullArgs });
        break;
        
      // Owner commands
      case "addsudo":
      case "block":
      case "delsudo":
      case "join":
      case "leave":
      case "restart":
      case "setbio":
      case "setprofilepic":
      case "tostatus":
      case "unblock":
      case "update":
      case "warn":
        if (!isOwner) response = "❌ This command is only for the owner!";
        else response = await ownerCmd.execute(command, { sock, from, args, fullArgs });
        break;
        
      // Religion commands
      case "bible":
      case "quran":
        response = await religionCmd.execute(command, { config, args, fullArgs });
        break;
        
      // Search commands
      case "define":
      case "imdb":
      case "lyrics":
      case "shazam":
      case "weather":
      case "yts":
        response = await searchCmd.execute(command, { config, args, fullArgs });
        break;
        
      // Settings commands
      case "autoreactstatus":
      case "autoreadstatus":
      case "autorecording":
      case "autotyping":
      case "chatbot":
      case "getsettings":
      case "mode":
      case "setbotname":
      case "setmenuimage":
      case "setownername":
      case "setownernumber":
      case "setprefix":
      case "setstatusemoji":
      case "settimezone":
      case "statusdelay":
      case "statussettings":
        if (!isOwner) response = "❌ Settings can only be changed by the owner!";
        else response = await settingsCmd.execute(command, { config, args, fullArgs });
        break;
        
      // Support commands
      case "feedback":
      case "helpers":
      case "support":
        response = await supportCmd.execute(command, { config });
        break;
        
      // Tools commands
      case "calculate":
      case "fancy":
      case "genpass":
      case "getpp":
      case "qrcode":
      case "say":
      case "ssweb":
      case "sticker":
      case "tinyurl":
      case "tourl":
        response = await toolsCmd.execute(command, { sock, from, msg, args, fullArgs });
        break;
        
      // Translate commands
      case "translate":
        response = await translateCmd.execute(command, { config, args, fullArgs });
        break;
        
      // Video commands
      case "toaudio":
      case "toimage":
      case "tovideo":
        response = await videoCmd.execute(command, { config, args, fullArgs });
        break;
        
      default:
        // Command not found
        return;
    }
    
    if (response) {
      await sock.sendMessage(from, { text: response }, { quoted: msg });
    }
    
  } catch (error) {
    console.error("❌ Handler error:", error);
  }
}

module.exports = { handleMessages };