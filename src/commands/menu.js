const os = require("os");

function safeConfig() {
  try {
    return require("../../config");
  } catch {
    return {};
  }
}

const config = safeConfig();

const VERSION = "1.9.4";
const MODE = process.env.MODE || "Public";
const HOST = process.env.HOST_NAME || "Heroku";

const MENU_CATEGORIES = {
  "AI MENU": [
    "analyze","blackbox","code","dalle","deepseek","doppleai","gemini",
    "generate","gpt","programming","recipe","story","summarize","teach","translate2",
  ],

  "AUDIO MENU": [
    "bass","blown","deep","earrape","reverse","robot","tomp3","toptt","volaudio",
  ],

  "DOWNLOAD MENU": [
    "apk","download","facebook","gdrive","gitclone","image","instagram",
    "itunes","mediafire","pin","savestatus","song","song2","telesticker",
    "tiktok","tiktokaudio","twitter","video","videodoc","xvideo",
  ],

  "FUN MENU": [
    "fact","jokes","memes","quotes","trivia","truthdetector","xxqc",
  ],

  "GAMES MENU": [
    "dare","truth","truthordare",
  ],

  "GROUP MENU": [
    "add","addcode","allow","announcements","antibadword","antibot",
    "antidemote","antiforeign","antigroupmention","antilink","antilinkgc",
    "antisticker","antitag","antitagadmin","approve","approveall",
    "cancelkick","close","closetime","delallowed","delcode","delppgroup",
    "demote","disapproveall","editsettings","getgrouppp","hidetag","invite",
    "kick","kickall","kickinactive","link","listactive","listallowed",
    "listcode","listinactive","listrequests","mediatag","open","opentime",
    "poll","promote","reject","resetlink","setdesc","setgroupname",
    "setppgroup","tag","tagadmin","tagall","totalmembers","userid","vcf","welcome",
  ],

  "GROUPSTATUS MENU": ["fetchgroups","tosgroup"],

  "IMAGE MENU": ["remini","wallpaper"],

  "OTHER MENU": ["botstatus","pair","ping","ping2","repo","runtime","time"],

  "OWNER MENU": [
    "owner","block","unblock","join","leave","restart","update",
    "setbio","setprofilepic","react",
  ],

  "RELIGION MENU": ["bible","quran"],

  "SEARCH MENU": [
    "define","define2","imdb","lyrics","shazam","weather","yts",
  ],

  "SETTINGS MENU": [
    "addbadword","addcountrycode","addignorelist","addsudo","alwaysonline",
    "antibug","anticall","antidelete","antideletestatus","antiedit",
    "antiviewonce","autobio","autoblock","autoreact","autoreactstatus",
    "autoread","autorecord","autorecordtyping","autotype","autoviewstatus",
    "chatbot","delanticallmsg","delcountrycode","deletebadword","delgoodbye",
    "delignorelist","delsudo","delwelcome","getsettings","listcountrycode",
    "listwarn","mode","resetsetting","resetwarn","setanticallmsg",
    "setbotname","setcontextlink","setfont","setgoodbye","setmenu",
    "setmenuimage","setownername","setownernumber","setprefix",
    "setstatusemoji","setstickerauthor","setstickerpackname","settimezone",
    "setwarn","setwatermark","setwelcome","showanticallmsg","showgoodbye",
    "showwelcome","statusdelay","statussettings","testanticallmsg",
    "testgoodbye","testwelcome",
  ],

  "SPORTS MENU": [
    "eplmatches","eplstandings","clmatches","wwenews",
  ],

  "SUPPORT MENU": ["feedback","helpers"],

  "TOOLS MENU": [
    "browse","calculate","device","emojimix","fancy","filtervcf",
    "fliptext","genpass","getabout","getpp","gsmarena","obfuscate",
    "qrcode","runeval","say","ssweb","sswebpc","sswebtab","sticker",
    "take","texttopdf","tinyurl","toimage","tourl","vcc",
  ],

  "TRANSLATE MENU": ["translate"],

  "VIDEO MENU": ["toaudio","tovideo","volvideo"],
};

function getUptime() {
  const t = process.uptime();
  return `${Math.floor(t/3600)}h ${Math.floor((t%3600)/60)}m ${Math.floor(t%60)}s`;
}

function getRam() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const percent = Math.round((used/total)*100);
  const bar = "█".repeat(Math.round(percent/10)) + "░".repeat(10 - Math.round(percent/10));
  return {
    used: Math.round(used/1024/1024),
    total: (total/1024/1024/1024).toFixed(1),
    percent,
    bar
  };
}

function getSpeed() {
  return (Math.random()*0.3+0.05).toFixed(4);
}

function countCommands() {
  return Object.values(MENU_CATEGORIES).flat().length;
}

function buildCategory(title, cmds, prefix) {
  const line = "━━━━━━━━━━━━━━━━━━━━━━";
  let text = `┏▣ ${line}
┃ ◈ ${title} ◈
┣▣ ${line}
`;

  cmds.forEach(c => {
    text += `┃ ➤ ${prefix}${c}\n`;
  });

  text += `┗▣ ${line}`;
  return text;
}

function buildMenu(ctx) {
  const owner = config.OWNER_NAME || "RichieeTheeGoat";
  const prefix = ctx.PREFIX || ".";
  const ram = getRam();
  const line = "━━━━━━━━━━━━━━━━━━━━━━";

  const header = `┏▣ ${line}
┃ ◈ ${ctx.BOT_NAME} ◈
┣▣ ${line}
┃ ᴏᴡɴᴇʀ   : ${owner}
┃ ᴘʀᴇғɪx  : [ ${prefix} ]
┃ ʜᴏsᴛ    : ${HOST}
┃ ᴘʟᴜɢɪɴs : ${countCommands()}
┃ ᴍᴏᴅᴇ    : ${MODE}
┃ ᴠᴇʀsɪᴏɴ : ${VERSION}
┃ sᴘᴇᴇᴅ   : ${getSpeed()} ms
┃ ᴜᴘᴛɪᴍᴇ  : ${getUptime()}
┃ ᴜsᴀɢᴇ   : ${ram.used} MB / ${ram.total} GB
┃ ʀᴀᴍ     : [${ram.bar}] ${ram.percent}%
┗▣ ${line}`;

  const body = Object.entries(MENU_CATEGORIES)
    .map(([t,c]) => buildCategory(t,c,prefix))
    .join("\n\n");

  return `${header}

${body}

> ${ctx.BOT_NAME} • Clean MD Bot`;
}

async function execute(sock, msg, args, ctx) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: buildMenu(ctx),
  });
}

module.exports = {
  name: "menu",
  description: "Show clean full menu",
  execute,
};
