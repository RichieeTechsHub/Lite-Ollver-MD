const config = require("../../config");
const { sendMenuWithLogo } = require("../commands/menu");

// Import all command modules
const otherCmd = require("../commands/other");
const aiCmd = require("../commands/ai");
const audioCmd = require("../commands/audio");
const downloadCmd = require("../commands/download");
const funCmd = require("../commands/fun");
const gamesCmd = require("../commands/games");
const groupCmd = require("../commands/group");
const imageCmd = require("../commands/image");
const ownerCmd = require("../commands/owner");
const religionCmd = require("../commands/religion");
const searchCmd = require("../commands/search");
const settingsCmd = require("../commands/settings");
const supportCmd = require("../commands/support");
const toolsCmd = require("../commands/tools");
const translateCmd = require("../commands/translate");
const videoCmd = require("../commands/video");

function normalizeNumber(num = "") {
  return String(num).replace(/\D/g, "");
}

function extractText(msg) {
  return (
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption ||
    msg.message?.buttonsResponseMessage?.selectedButtonId ||
    msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    msg.message?.templateButtonReplyMessage?.selectedId ||
    ""
  ).trim();
}

async function sendStartupMessage(sock) {
  try {
    const ownerJid = `${normalizeNumber(config.OWNER_NUMBER)}@s.whatsapp.net`;

    const startupMessage = `╔══════════════════════════════════╗
║   ✅ BOT CONNECTED SUCCESSFULLY  ║
╚══════════════════════════════════╝

👑 *Owner:* ${config.OWNER_NAME}
🤖 *Bot:* ${config.BOT_NAME}
🔣 *Prefix:* ${config.PREFIX}
🌍 *Mode:* ${config.MODE}
⚡ *Status:* Online
📦 *Commands:* 126+

╔══════════════════════════════════╗
║   📥 Bot is active in your inbox ║
║   Type .menu to see all commands ║
╚══════════════════════════════════╝`;

    await sock.sendMessage(ownerJid, { text: startupMessage });
    console.log("✅ Startup message sent to owner");
  } catch (error) {
    console.log("⚠️ Could not send startup message:", error.message);
  }
}

async function handleMessages(sock, msg) {
  try {
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || from;
    const isGroup = from.endsWith("@g.us");

    const senderNumber = normalizeNumber(sender.split("@")[0]);
    const ownerNumber = normalizeNumber(config.OWNER_NUMBER);
    const isOwner = senderNumber === ownerNumber || msg.key.fromMe === true;

    const text = extractText(msg);

    if (!text) {
      console.log(`⚠️ Empty/unreadable message from ${senderNumber}`);
      return;
    }

    console.log(
      `📨 [${new Date().toLocaleTimeString()}] From: ${senderNumber}${isGroup ? " (group)" : " (inbox)"} | fromMe=${msg.key.fromMe} | text=${text}`
    );

    if (!text.startsWith(config.PREFIX)) return;

    const args = text.slice(config.PREFIX.length).trim().split(/\s+/);
    const command = args.shift()?.toLowerCase();
    const fullArgs = args.join(" ");

    console.log(`⚡ Command detected: ${config.PREFIX}${command} from ${senderNumber}${isGroup ? " (group)" : " (inbox)"}`);
    console.log(`✅ Processing command ${command} | from=${senderNumber} | fromMe=${msg.key.fromMe}`);

    if (config.MODE === "private" && !isOwner && !isGroup) {
      await sock.sendMessage(
        from,
        { text: "🔒 Bot is in *private mode*. Only owner and groups can use commands." },
        { quoted: msg }
      );
      return;
    }

    let response = null;

    switch (command) {
      case "menu":
      case "help":
      case "commands":
        await sendMenuWithLogo(sock, from, msg);
        return;

      case "ping":
      case "alive":
      case "owner":
      case "repo":
      case "runtime":
      case "support":
      case "time":
      case "botstatus":
      case "speed":
        response = await otherCmd.execute(command, {
          sock,
          from,
          senderNumber,
          isOwner,
          args,
          fullArgs,
          config
        });
        break;

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
        response = await aiCmd.execute(command, { args, fullArgs });
        break;

      case "bass":
      case "deep":
      case "reverse":
      case "robot":
      case "tomp3":
      case "toptt":
      case "volaudio":
        response = await audioCmd.execute(command, { args, fullArgs });
        break;

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
        response = await downloadCmd.execute(command, { args, fullArgs });
        break;

      case "fact":
      case "jokes":
      case "memes":
      case "quotes":
      case "trivia":
        response = await funCmd.execute(command, { args, fullArgs });
        break;

      case "dare":
      case "truth":
      case "truthordare":
        response = await gamesCmd.execute(command, { args, fullArgs });
        break;

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
        if (!isGroup) {
          response = "❌ This command only works in groups!";
        } else {
          response = await groupCmd.execute(command, {
            sock,
            from,
            msg,
            args,
            fullArgs,
            isOwner
          });
        }
        break;

      case "remini":
      case "wallpaper":
        response = await imageCmd.execute(command, { args, fullArgs });
        break;

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
        if (!isOwner) {
          response = "❌ This command is only for the owner!";
        } else {
          response = await ownerCmd.execute(command, { sock, from, args, fullArgs });
        }
        break;

      case "bible":
      case "quran":
        response = await religionCmd.execute(command, { args, fullArgs });
        break;

      case "define":
      case "imdb":
      case "lyrics":
      case "shazam":
      case "weather":
      case "yts":
        response = await searchCmd.execute(command, { args, fullArgs });
        break;

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
        if (!isOwner) {
          response = "❌ Settings can only be changed by the owner!";
        } else {
          response = await settingsCmd.execute(command, { args, fullArgs, config });
        }
        break;

      case "feedback":
      case "helpers":
      case "support":
        response = await supportCmd.execute(command, { config, args, fullArgs });
        break;

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

      case "translate":
        response = await translateCmd.execute(command, { args, fullArgs });
        break;

      case "toaudio":
      case "toimage":
      case "tovideo":
        response = await videoCmd.execute(command, { args, fullArgs });
        break;

      default:
        console.log(`❓ Unknown command: ${command}`);
        await sock.sendMessage(
          from,
          { text: `❌ Unknown command: ${command}` },
          { quoted: msg }
        );
        return;
    }

    if (response) {
      await sock.sendMessage(from, { text: response }, { quoted: msg });
      console.log(`✅ Response sent for: ${command}`);
    }
  } catch (error) {
    console.error("❌ Handler error:", error);
  }
}

module.exports = { handleMessages, sendStartupMessage };
