const fs = require("fs");
const path = require("path");

const commandsDir = path.join(__dirname, "..", "src", "commands");
const libDir = path.join(__dirname, "..", "src", "lib");

fs.mkdirSync(commandsDir, { recursive: true });
fs.mkdirSync(libDir, { recursive: true });

const commands = [
  "analyze","blackbox","code","dalle","deepseek","doppleai","gemini","generate","gpt","programming","recipe","story","summarize","teach","translate2",
  "bass","blown","deep","earrape","reverse","robot","tomp3","toptt","volaudio",
  "apk","download","facebook","gdrive","gitclone","image","instagram","itunes","mediafire","pin","savestatus","song","song2","telesticker","tiktok","tiktokaudio","twitter","video","videodoc","xvideo",
  "fact","jokes","memes","quotes","trivia","truthdetector","xxqc",
  "dare","truth","truthordare",
  "add","addcode","allow","announcements","antibadword","antibot","antidemote","antiforeign","antigroupmention","antilink","antilinkgc","antisticker","antitag","antitagadmin","approve","approveall","cancelkick","close","closetime","delallowed","delcode","delppgroup","demote","disapproveall","editsettings","getgrouppp","hidetag","invite","kick","kickall","kickinactive","link","listactive","listallowed","listcode","listinactive","listrequests","mediatag","open","opentime","poll","promote","reject","resetlink","setdesc","setgroupname","setppgroup","tag","tagadmin","tagall","totalmembers","userid","vcf","welcome",
  "fetchgroups","tosgroup",
  "remini","wallpaper",
  "botstatus","pair","ping","ping2","repo","runtime","time",
  "owner","block","unblock","join","leave","restart","update","setbio","setprofilepic","react",
  "bible","quran",
  "define","define2","imdb","lyrics","shazam","weather","yts",
  "addbadword","addcountrycode","addignorelist","addsudo","alwaysonline","antibug","anticall","antidelete","antideletestatus","antiedit","antiviewonce","autobio","autoblock","autoreact","autoreactstatus","autoread","autorecord","autorecordtyping","autotype","autoviewstatus","chatbot","delanticallmsg","delcountrycode","deletebadword","delgoodbye","delignorelist","delsudo","delwelcome","getsettings","listcountrycode","listwarn","mode","resetsetting","resetwarn","setanticallmsg","setbotname","setcontextlink","setfont","setgoodbye","setmenu","setmenuimage","setownername","setownernumber","setprefix","setstatusemoji","setstickerauthor","setstickerpackname","settimezone","setwarn","setwatermark","setwelcome","showanticallmsg","showgoodbye","showwelcome","statusdelay","statussettings","testanticallmsg","testgoodbye","testwelcome",
  "eplmatches","eplstandings","clmatches","wwenews",
  "feedback","helpers",
  "browse","calculate","device","emojimix","fancy","filtervcf","fliptext","genpass","getabout","getpp","gsmarena","obfuscate","qrcode","runeval","say","ssweb","sswebpc","sswebtab","sticker","take","texttopdf","tinyurl","toimage","tourl","vcc",
  "translate",
  "toaudio","tovideo","volvideo"
];

function makeCommand(name) {
  if (name === "ping" || name === "ping2") {
    return `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, { text: "🏓 Pong!" });
}

module.exports = { name: "${name}", description: "Ping command", execute };
`;
  }

  if (name === "runtime") {
    return `function getRuntime() {
  const t = process.uptime();
  return \`\${Math.floor(t/3600)}h \${Math.floor((t%3600)/60)}m \${Math.floor(t%60)}s\`;
}

async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, { text: "⏱ Runtime: " + getRuntime() });
}

module.exports = { name: "runtime", description: "Show bot runtime", execute };
`;
  }

  if (name === "time") {
    return `async function execute(sock, msg) {
  const now = new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" });
  await sock.sendMessage(msg.key.remoteJid, { text: "🕒 Kenya Time: " + now });
}

module.exports = { name: "time", description: "Show current time", execute };
`;
  }

  if (name === "calculate") {
    return `async function execute(sock, msg, args) {
  const exp = args.join(" ");
  if (!exp) return sock.sendMessage(msg.key.remoteJid, { text: "🧮 Example: .calculate 10+20*3" });

  try {
    if (!/^[0-9+\\-*/().%\\s]+$/.test(exp)) throw new Error("Invalid");
    const result = Function('"use strict"; return (' + exp + ')')();
    await sock.sendMessage(msg.key.remoteJid, { text: "🧮 Result: " + result });
  } catch {
    await sock.sendMessage(msg.key.remoteJid, { text: "❌ Invalid calculation." });
  }
}

module.exports = { name: "calculate", description: "Calculator", execute };
`;
  }

  if (["gpt","gemini","deepseek","blackbox","code","programming","summarize","teach","recipe","story","generate","analyze","translate2","dalle","doppleai"].includes(name)) {
    return `async function execute(sock, msg, args) {
  const input = args.join(" ");
  if (!input) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .${name} your text here" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤖 ${name} command received:\\n\\n" + input + "\\n\\n⚠️ AI API logic will be connected next."
  });
}

module.exports = { name: "${name}", description: "${name} AI command", execute };
`;
  }

  return `async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *${name}* command is working.\\n\\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "${name}", description: "${name} command", execute };
`;
}

let created = 0;
let updated = 0;

for (const cmd of commands) {
  const file = path.join(commandsDir, cmd + ".js");

  if (fs.existsSync(file)) {
    updated++;
  } else {
    created++;
  }

  fs.writeFileSync(file, makeCommand(cmd));
}

console.log("✅ All menu commands injected.");
console.log("📁 Created:", created);
console.log("♻️ Updated:", updated);
console.log("📦 Total:", commands.length);
