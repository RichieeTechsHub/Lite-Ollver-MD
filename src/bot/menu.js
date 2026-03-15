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
  const lines = [
    `┏▣ ◈ *${title}* ◈`,
    ...commands.map((cmd) => `│➽ ${cmd}`),
    "┗▣"
  ];

  return lines.join("\n");
}

function buildMainMenu({
  ownerName = config.OWNER_NAME,
  prefix = config.PREFIX,
  mode = config.MODE,
  version = config.VERSION,
  host = "Heroku",
  speed = "0.0000"
} = {}) {
  const ram = getRamUsage();

  const header = [
    "┏▣ ◈ *LITE-OLLVER-MD* ◈",
    `┃ *ᴏᴡɴᴇʀ* : ${ownerName}`,
    `┃ *ᴘʀᴇғɪx* : [ ${prefix} ]`,
    `┃ *ʜᴏsᴛ* : ${host}`,
    "┃ *ᴘʟᴜɢɪɴs* : 80",
    `┃ *ᴍᴏᴅᴇ* : ${formatMode(mode)}`,
    `┃ *ᴠᴇʀsɪᴏɴ* : ${version}`,
    `┃ *sᴘᴇᴇᴅ* : ${speed} ms`,
    `┃ *ᴜsᴀɢᴇ* : ${ram.usedMB} MB of ${ram.totalGB} GB`,
    `┃ *ʀᴀᴍ:* [${getRamBar(ram.percent)}] ${ram.percent}%`,
    "┗▣"
  ].join("\n");

  const sections = [
    buildSection("AI MENU", [
      "analyze",
      "blackbox",
      "code",
      "generate",
      "gpt",
      "recipe",
      "story",
      "summarize",
      "teach",
      "translate2"
    ]),
    buildSection("AUDIO MENU", [
      "bass",
      "deep",
      "reverse",
      "robot",
      "tomp3",
      "toptt",
      "volaudio"
    ]),
    buildSection("DOWNLOAD MENU", [
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
    ]),
    buildSection("FUN MENU", [
      "fact",
      "jokes",
      "memes",
      "quotes",
      "trivia"
    ]),
    buildSection("GROUP MENU", [
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
    ]),
    buildSection("OTHER MENU", [
      "botstatus",
      "owner",
      "pair",
      "ping",
      "repo",
      "runtime",
      "time"
    ]),
    buildSection("OWNER MENU", [
      "addsudo",
      "block",
      "delsudo",
      "join",
      "leave",
      "restart",
      "setbio",
      "setprofilepic",
      "tostatus",
      "update"
    ]),
    buildSection("SEARCH MENU", [
      "define",
      "imdb",
      "lyrics",
      "shazam",
      "weather"
    ]),
    buildSection("SETTINGS MENU", [
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
    ]),
    buildSection("TOOLS MENU", [
      "calculate",
      "fancy",
      "genpass",
      "getpp",
      "qrcode",
      "say",
      "ssweb",
      "sticker",
      "tinyurl",
      "toimage",
      "tourl"
    ])
  ];

  return [header, ...sections].join("\n\n");
}

module.exports = {
  buildMainMenu,
  buildSection
};