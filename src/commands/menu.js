const fs = require("fs");
const path = require("path");
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

const LOGO_PATH = path.join(__dirname, "..", "..", "assets", "logo.png");
const FALLBACK_LOGO =
  process.env.MENU_LOGO_URL || "https://i.ibb.co/5R9kHkH/bot-logo.jpg";

const MENU_CATEGORIES = {
  "AI MENU": ["analyze","blackbox","code","dalle","deepseek","doppleai","gemini","generate","gpt","programming","recipe","story","summarize","teach","translate2"],
  "AUDIO MENU": ["bass","blown","deep","earrape","reverse","robot","tomp3","toptt","volaudio"],
  "DOWNLOAD MENU": ["apk","download","facebook","gdrive","gitclone","image","instagram","itunes","mediafire","pin","savestatus","song","song2","telesticker","tiktok","tiktokaudio","twitter","video","videodoc","xvideo"],
  "FUN MENU": ["fact","jokes","memes","quotes","trivia","truthdetector","xxqc"],
  "GAMES MENU": ["dare","truth","truthordare"],
  "GROUP MENU": ["add","addcode","allow","announcements","antibadword","antibot","antidemote","antiforeign","antigroupmention","antilink","antilinkgc","antisticker","antitag","antitagadmin","approve","approveall","cancelkick","close","closetime","delallowed","delcode","delppgroup","demote","disapproveall","editsettings","getgrouppp","hidetag","invite","kick","kickall","kickinactive","link","listactive","listallowed","listcode","listinactive","listrequests","mediatag","open","opentime","poll","promote","reject","resetlink","setdesc","setgroupname","setppgroup","tag","tagadmin","tagall","totalmembers","userid","vcf","welcome"],
  "GROUPSTATUS MENU": ["fetchgroups","tosgroup"],
  "IMAGE MENU": ["remini","wallpaper"],
  "OTHER MENU": ["botstatus","pair","ping","ping2","repo","runtime","time"],
  "OWNER MENU": ["owner","block","unblock","join","leave","restart","update","setbio","setprofilepic","react","vv"],
  "RELIGION MENU": ["bible","quran"],
  "SEARCH MENU": ["define","define2","imdb","lyrics","shazam","weather","yts"],
  "SETTINGS MENU": ["addbadword","addcountrycode","addignorelist","addsudo","alwaysonline","antibug","anticall","antidelete","antideletestatus","antiedit","antiviewonce","autobio","autoblock","autoreact","autoreactstatus","autoread","autorecord","autorecordtyping","autotype","autoviewstatus","chatbot","delanticallmsg","delcountrycode","deletebadword","delgoodbye","delignorelist","delsudo","delwelcome","getsettings","listcountrycode","listwarn","mode","resetsetting","resetwarn","setanticallmsg","setbotname","setcontextlink","setfont","setgoodbye","setmenu","setmenuimage","setownername","setownernumber","setprefix","setstatusemoji","setstickerauthor","setstickerpackname","settimezone","setwarn","setwatermark","setwelcome","showanticallmsg","showgoodbye","showwelcome","statusdelay","statussettings","testanticallmsg","testgoodbye","testwelcome"],
  "SPORTS MENU": ["eplmatches","eplstandings","clmatches","wwenews"],
  "SUPPORT MENU": ["feedback","helpers"],
  "TOOLS MENU": ["browse","calculate","device","emojimix","fancy","filtervcf","fliptext","genpass","getabout","getpp","gsmarena","obfuscate","qrcode","runeval","say","ssweb","sswebpc","sswebtab","sticker","take","texttopdf","tinyurl","toimage","tourl","vcc"],
  "TRANSLATE MENU": ["translate"],
  "VIDEO MENU": ["toaudio","tovideo","volvideo"],
};

function getUptime() {
  const t = process.uptime();
  return `${Math.floor(t / 3600)}h ${Math.floor((t % 3600) / 60)}m ${Math.floor(t % 60)}s`;
}

function getRam() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const percent = Math.round((used / total) * 100);
  const filled = Math.min(10, Math.max(0, Math.round(percent / 10)));
  const bar = "â–ˆ".repeat(filled) + "â–‘".repeat(10 - filled);

  return {
    used: Math.round(used / 1024 / 1024),
    total: (total / 1024 / 1024 / 1024).toFixed(1),
    percent,
    bar,
  };
}

function getSpeed() {
  return (Math.random() * 0.3 + 0.05).toFixed(4);
}

function countCommands() {
  return Object.values(MENU_CATEGORIES).flat().length;
}

// âœ… FIXED (NO PREFIX IN COMMAND LIST)
function buildCategory(title, cmds) {
  const line = "â”â”â”â”â”â”â”â”â”â”â”â”";
  let text = `â•­â”€â ${title}\n`;

  cmds.forEach((c) => {
    text += `â”‚â—¦ ${c}\n`;
  });

  text += `â•°${line}`;
  return text;
}

function buildMenu(ctx) {
  const owner = config.OWNER_NAME || "RichieeTheeGoat";
  const prefix = ctx.PREFIX || ".";
  const ram = getRam();
  const line = "â”â”â”â”â”â”â”â”â”â”â”â”";

  const header = `â•­â”€â ${ctx.BOT_NAME || "Lite-Ollver-MD"}
â”‚ owner  : ${owner}
â”‚ prefix : ${prefix}
â”‚ host   : ${HOST}
â”‚ cmds   : ${countCommands()}
â”‚ mode   : ${ctx.MODE || MODE}
â”‚ ver    : ${VERSION}
â”‚ speed  : ${getSpeed()} ms
â”‚ uptime : ${getUptime()}
â”‚ usage  : ${ram.used} MB / ${ram.total} GB
â”‚ ram    : [${ram.bar}] ${ram.percent}%
â•°${line}`;

  const body = Object.entries(MENU_CATEGORIES)
    .map(([t, c]) => buildCategory(t, c))
    .join("\n\n");

  return `${header}

${body}

> ${ctx.BOT_NAME || "Lite-Ollver-MD"}`;
}

function getMenuImage() {
  if (fs.existsSync(LOGO_PATH)) {
    return fs.readFileSync(LOGO_PATH);
  }

  return { url: FALLBACK_LOGO };
}

async function execute(sock, msg, args, ctx) {
  const menuText = buildMenu(ctx);

  try {
    await sock.sendMessage(msg.key.remoteJid, {
      image: getMenuImage(),
      caption: menuText,
    });
  } catch {
    await sock.sendMessage(msg.key.remoteJid, {
      text: menuText,
    });
  }
}

module.exports = {
  name: "menu",
  description: "Show slim menu with logo",
  execute,
};
