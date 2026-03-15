const os = require("os");
const config = require("../../config");

function formatMode(mode = "public") {
  return mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase();
}

function getRamUsage() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const percent = ((used / total) * 100).toFixed(0);

  return {
    usedMB: Math.round(used / 1024 / 1024),
    totalGB: (total / 1024 / 1024 / 1024).toFixed(0),
    percent
  };
}

function getRamBar(percent) {
  const value = Number(percent);
  const filled = Math.max(1, Math.min(10, Math.round(value / 10)));
  return "█".repeat(filled) + "░".repeat(10 - filled);
}

function buildSection(title, commands = []) {
  return [
    `┏▣ ◈ *${title}* ◈`,
    ...commands.map((cmd) => `│➽ ${cmd}`),
    "┗▣"
  ].join("\n");
}

function buildMainMenu({
  ownerName = config.OWNER_NAME,
  prefix = config.PREFIX,
  mode = config.MODE,
  version = config.VERSION,
  host = "Heroku",
  speed = "0.2100"
} = {}) {
  const ram = getRamUsage();

  const aiMenu = [
    "analyze",
    "blackbox",
    "code",
    "generate",
    "gpt",
    "programming",
    "recipe",
    "story",
    "summarize",
    "teach"
  ];

  const audioMenu = [
    "bass",
    "deep",
    "reverse",
    "robot",
    "tomp3",
    "toptt",
    "volaudio"
  ];

  const downloadMenu = [
    "apk",
    "facebook",
    "gdrive",
    "gitclone",
    "image",
    "instagram",
    "mediafire",
    "song",
    "tiktok",
    "twitter",
    "video"
  ];

  const funMenu = [
    "fact",
    "jokes",
    "memes",
    "quotes",
    "trivia"
  ];

  const gamesMenu = [
    "dare",
    "truth",
    "truthordare"
  ];

  const groupMenu = [
    "add",
    "antilink",
    "close",
    "demote",
    "goodbye",
    "hidetag",
    "invite",
    "kick",
    "link",
    "open",
    "poll",
    "promote",
    "resetlink",
    "setdesc",
    "setgoodbye",
    "setgroupname",
    "setwelcome",
    "showgoodbye",
    "showwelcome",
    "tagadmin",
    "tagall",
    "testgoodbye",
    "testwelcome",
    "totalmembers",
    "welcome"
  ];

  const imageMenu = [
    "remini",
    "wallpaper"
  ];

  const otherMenu = [
    "alive",
    "botstatus",
    "menu",
    "owner",
    "pair",
    "ping",
    "repo",
    "runtime",
    "support",
    "time"
  ];

  const ownerMenu = [
    "addsudo",
    "block",
    "delsudo",
    "join",
    "leave",
    "restart",
    "setbio",
    "setprofilepic",
    "tostatus",
    "unblock",
    "update",
    "warn"
  ];

  const religionMenu = [
    "bible",
    "quran"
  ];

  const searchMenu = [
    "define",
    "imdb",
    "lyrics",
    "shazam",
    "weather",
    "yts"
  ];

  const settingsMenu = [
    "autoreactstatus",
    "autoreadstatus",
    "autorecording",
    "autotyping",
    "chatbot",
    "getsettings",
    "mode",
    "setbotname",
    "setmenuimage",
    "setownername",
    "setownernumber",
    "setprefix",
    "setstatusemoji",
    "settimezone",
    "statusdelay",
    "statussettings"
  ];

  const supportMenu = [
    "feedback",
    "helpers",
    "support"
  ];

  const toolsMenu = [
    "calculate",
    "fancy",
    "genpass",
    "getpp",
    "qrcode",
    "say",
    "ssweb",
    "sticker",
    "tinyurl",
    "tourl"
  ];

  const translateMenu = [
    "translate"
  ];

  const videoMenu = [
    "toaudio",
    "toimage",
    "tovideo"
  ];

  const pluginCount =
    aiMenu.length +
    audioMenu.length +
    downloadMenu.length +
    funMenu.length +
    gamesMenu.length +
    groupMenu.length +
    imageMenu.length +
    otherMenu.length +
    ownerMenu.length +
    religionMenu.length +
    searchMenu.length +
    settingsMenu.length +
    supportMenu.length +
    toolsMenu.length +
    translateMenu.length +
    videoMenu.length;

  const header = [
    `┏▣ ◈ *${config.BOT_NAME || "LITE-OLLVER-MD"}* ◈`,
    `┃ *ᴏᴡɴᴇʀ* : ${ownerName || "Not Set!"}`,
    `┃ *ᴘʀᴇғɪx* : [ ${prefix} ]`,
    `┃ *ʜᴏsᴛ* : ${host}`,
    `┃ *ᴘʟᴜɢɪɴs* : ${pluginCount}`,
    `┃ *ᴍᴏᴅᴇ* : ${formatMode(mode)}`,
    `┃ *ᴠᴇʀsɪᴏɴ* : ${version}`,
    `┃ *sᴘᴇᴇᴅ* : ${speed} ms`,
    `┃ *ᴜsᴀɢᴇ* : ${ram.usedMB} MB of ${ram.totalGB} GB`,
    `┃ *ʀᴀᴍ:* [${getRamBar(ram.percent)}] ${ram.percent}%`,
    "┗▣"
  ].join("\n");

  const sections = [
    buildSection("AI MENU", aiMenu),
    buildSection("AUDIO MENU", audioMenu),
    buildSection("DOWNLOAD MENU", downloadMenu),
    buildSection("FUN MENU", funMenu),
    buildSection("GAMES MENU", gamesMenu),
    buildSection("GROUP MENU", groupMenu),
    buildSection("IMAGE MENU", imageMenu),
    buildSection("OTHER MENU", otherMenu),
    buildSection("OWNER MENU", ownerMenu),
    buildSection("RELIGION MENU", religionMenu),
    buildSection("SEARCH MENU", searchMenu),
    buildSection("SETTINGS MENU", settingsMenu),
    buildSection("SUPPORT MENU", supportMenu),
    buildSection("TOOLS MENU", toolsMenu),
    buildSection("TRANSLATE MENU", translateMenu),
    buildSection("VIDEO MENU", videoMenu)
  ];

  return [header, ...sections].join("\n\n");
}

module.exports = {
  buildMainMenu,
  buildSection
};