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
const MODE = process.env.MODE || "public";
const HOST = process.env.HOST_NAME || "Heroku";

const LOGO_PATH = path.join(__dirname, "..", "..", "assets", "menu.png");
const FALLBACK_LOGO =
  process.env.MENU_LOGO_URL || "https://i.ibb.co/5R9kHkH/bot-logo.jpg";

const MENU_CATEGORIES = {
  "AI MENU": ["analyze","blackbox","code","dalle","deepseek","doppleai","gemini","generate","gpt","programming","recipe","story","summarize","teach","translate2"],
  "AUDIO MENU": ["bass","blown","deep","earrape","reverse","robot","tomp3","toptt","volaudio"],
  "DOWNLOAD MENU": ["song","song2","video","yts","tiktok","tiktokaudio","instagram","facebook","twitter","mediafire","gitclone","gdrive","savestatus"],
  "FUN MENU": ["fact","jokes","memes","quotes","trivia","truthdetector","xxqc"],
  "GAMES MENU": ["dare","truth","truthordare"],
  "GROUP MENU": ["add","addcode","allow","announcements","antibadword","antibot","antidemote","antiforeign","antigroupmention","antilink","antilinkgc","antisticker","antitag","antitagadmin","approve","approveall","cancelkick","close","closetime","delallowed","delcode","delppgroup","demote","disapproveall","editsettings","getgrouppp","hidetag","invite","kick","kickall","kickinactive","link","listactive","listallowed","listcode","listinactive","listrequests","mediatag","open","opentime","poll","promote","reject","resetlink","setdesc","setgroupname","setppgroup","tag","tagadmin","tagall","totalmembers","userid","vcf","welcome"],
  "GROUPSTATUS MENU": ["fetchgroups","tosgroup"],
  "IMAGE MENU": ["remini","wallpaper"],
  "OTHER MENU": ["botstatus","pair","ping","ping2","repo","runtime","time"],
  "OWNER MENU": ["owner","addowner","block","unblock","join","leave","restart","update","setbio","setprofilepic","react"],
  "RELIGION MENU": ["bible","quran"],
  "SEARCH MENU": ["define","define2","imdb","lyrics","shazam","weather"],
  "SETTINGS MENU": ["addbadword","addcountrycode","addignorelist","addsudo","antibug","anticall","antideletestatus","antiedit","antiviewonce","autobio","autoblock","autoreact","autoreactstatus","autoread","autorecord","autorecordtyping","autotype","chatbot","delanticallmsg","delcountrycode","deletebadword","delgoodbye","delignorelist","delsudo","delwelcome","getsettings","listcountrycode","listwarn","mode","resetsetting","resetwarn","setanticallmsg","setbotname","setcontextlink","setfont","setgoodbye","setmenu","setmenuimage","setownername","setownernumber","setprefix","setstatusemoji","setstickerauthor","setstickerpackname","settimezone","setwarn","setwatermark","setwelcome","showanticallmsg","showgoodbye","showwelcome","statusdelay","statussettings","testanticallmsg","testgoodbye","testwelcome"],
  "SPORTS MENU": ["eplmatches","eplstandings","clmatches","wwenews"],
  "SUPPORT MENU": ["feedback","helpers"],
  "TOOLS MENU": ["browse","calculate","device","emojimix","fancy","filtervcf","fliptext","genpass","getabout","getpp","gsmarena","obfuscate","qrcode","runeval","say","ssweb","sswebpc","sswebtab","sticker","take","texttopdf","tinyurl","toimage","tourl","vcc"],
  "EXTRAS MENU": ["vv","antidelete","autoviewstatus","autoreactstatus","alwaysonline","stickers","mystickers","sendsticker","delsticker"],
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

  return {
    used: Math.round(used / 1024 / 1024),
    total: (total / 1024 / 1024 / 1024).toFixed(1),
    percent,
  };
}

function getSpeed() {
  return (Math.random() * 0.3 + 0.05).toFixed(4);
}

function countCommands() {
  return Object.values(MENU_CATEGORIES).flat().length;
}

function buildCategory(title, cmds) {
  let text = `\n*${title}*\n`;

  cmds.forEach((cmd) => {
    text += `• ${cmd}\n`;
  });

  return text;
}

function buildMenu(ctx) {
  const owner = config.OWNER_NAME || process.env.OWNER_NAME || "RichieeTheeGoat";
  const prefix = ctx.PREFIX || ".";
  const ram = getRam();

  const header =
`*${ctx.BOT_NAME || "Lite-Ollver-MD"}*

Owner  : ${owner}
Prefix : ${prefix}
Host   : ${HOST}
Cmds   : ${countCommands()}
Mode   : ${ctx.MODE || MODE}
Ver    : ${VERSION}
Speed  : ${getSpeed()} ms
Uptime : ${getUptime()}
Usage  : ${ram.used} MB / ${ram.total} GB
RAM    : ${ram.percent}%
`;

  const body = Object.entries(MENU_CATEGORIES)
    .map(([title, commands]) => buildCategory(title, commands))
    .join("");

  return `${header}${body}\n*${ctx.BOT_NAME || "Lite-Ollver-MD"}*`;
}

function getMenuImage() {
  if (fs.existsSync(LOGO_PATH)) {
    return fs.readFileSync(LOGO_PATH);
  }

  return { url: FALLBACK_LOGO };
}

function splitText(text, max = 3200) {
  const chunks = [];
  let current = "";

  for (const line of text.split("\n")) {
    if ((current + "\n" + line).length > max) {
      if (current) chunks.push(current);
      current = line;
    } else {
      current += (current ? "\n" : "") + line;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

async function execute(sock, msg, args, ctx) {
  const menuText = buildMenu(ctx);
  const chunks = splitText(menuText);

  try {
    await sock.sendMessage(msg.key.remoteJid, {
      image: getMenuImage(),
      caption: `🤖 *${ctx.BOT_NAME || "Lite-Ollver-MD"} MENU*`,
    });
  } catch {}

  for (const chunk of chunks) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: chunk,
    });
  }
}

module.exports = {
  name: "menu",
  description: "Show clean menu with logo",
  execute,
};
