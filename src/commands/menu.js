const config = require("../../config");
const os = require("os");

function getUptime() {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  return `${hours}h ${minutes}m ${seconds}s`;
}

function getRamUsage() {
  const total = os.totalmem() / 1024 / 1024 / 1024;
  const free = os.freemem() / 1024 / 1024 / 1024;
  const used = total - free;
  const percent = ((used / total) * 100).toFixed(1);
  return {
    used: used.toFixed(1),
    total: total.toFixed(1),
    percent: percent
  };
}

function getSpeed() {
  return (Math.random() * 0.5 + 0.1).toFixed(4);
}

function buildMenu() {
  const ram = getRamUsage();
  const speed = getSpeed();
  const uptime = getUptime();
  
  const totalCommands = 126; // Your total commands count
  
  // ASCII Logo Card
  const logoCard = `
╔══════════════════════════════════╗
║     ⚡ LITE-OLLVER-MD ⚡         ║
║   WhatsApp Multi-Device Bot      ║
╚══════════════════════════════════╝`;

  // Main Info Card
  const infoCard = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃           BOT INFO              ┃
┠────────────────────────────────┨
┃ 👑 Owner    : ${config.OWNER_NAME}
┃ 🤖 Bot Name : ${config.BOT_NAME}
┃ 🔣 Prefix   : [ ${config.PREFIX} ]
┃ 🌍 Mode     : ${config.MODE}
┃ 📦 Plugins  : ${totalCommands}
┃ 🚀 Speed    : ${speed} ms
┃ ⏱️ Uptime   : ${uptime}
┃ 💾 RAM      : ${ram.used}GB/${ram.total}GB (${ram.percent}%)
┃ 🌐 Host     : Heroku
┃ 📱 Number   : ${config.OWNER_NUMBER}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

  // Commands by Category
  const commandsCard = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃        COMMAND CATEGORIES       ┃
┠────────────────────────────────┨
┃ 🤖 AI (10)                      ┃
┃    analyze, blackbox, code,     ┃
┃    generate, gpt, programming   ┃
┃    recipe, story, summarize,    ┃
┃    teach                        ┃
┠────────────────────────────────┨
┃ 🎵 AUDIO (7)                    ┃
┃    bass, deep, reverse, robot,  ┃
┃    tomp3, toptt, volaudio       ┃
┠────────────────────────────────┨
┃ 📥 DOWNLOAD (11)                ┃
┃    apk, facebook, gdrive,       ┃
┃    gitclone, image, instagram,  ┃
┃    mediafire, song, tiktok,     ┃
┃    twitter, video                ┃
┠────────────────────────────────┨
┃ 🎭 FUN (5)                      ┃
┃    fact, jokes, memes, quotes,  ┃
┃    trivia                       ┃
┠────────────────────────────────┨
┃ 🎮 GAMES (3)                    ┃
┃    dare, truth, truthordare     ┃
┠────────────────────────────────┨
┃ 👥 GROUP (25)                   ┃
┃    add, antilink, close,        ┃
┃    demote, goodbye, hidetag,    ┃
┃    invite, kick, link, open,    ┃
┃    poll, promote, resetlink,    ┃
┃    setdesc, setgoodbye,         ┃
┃    setgroupname, setwelcome,    ┃
┃    showgoodbye, showwelcome,    ┃
┃    tagadmin, tagall,            ┃
┃    testgoodbye, testwelcome,    ┃
┃    totalmembers, welcome         ┃
┠────────────────────────────────┨
┃ 🖼️ IMAGE (2)                    ┃
┃    remini, wallpaper             ┃
┠────────────────────────────────┨
┃ 📌 OTHER (10)                   ┃
┃    alive, botstatus, menu,      ┃
┃    owner, pair, ping, repo,     ┃
┃    runtime, support, time        ┃
┠────────────────────────────────┨
┃ 👑 OWNER (12)                   ┃
┃    addsudo, block, delsudo,     ┃
┃    join, leave, restart,        ┃
┃    setbio, setprofilepic,       ┃
┃    tostatus, unblock, update,   ┃
┃    warn                         ┃
┠────────────────────────────────┨
┃ 🕋 RELIGION (2)                 ┃
┃    bible, quran                  ┃
┠────────────────────────────────┨
┃ 🔍 SEARCH (6)                   ┃
┃    define, imdb, lyrics,        ┃
┃    shazam, weather, yts          ┃
┠────────────────────────────────┨
┃ ⚙️ SETTINGS (16)                ┃
┃    autoreactstatus,             ┃
┃    autoreadstatus,              ┃
┃    autorecording, autotyping,   ┃
┃    chatbot, getsettings, mode,  ┃
┃    setbotname, setmenuimage,    ┃
┃    setownername, setownernumber,┃
┃    setprefix, setstatusemoji,   ┃
┃    settimezone, statusdelay,    ┃
┃    statussettings                ┃
┠────────────────────────────────┨
┃ 💬 SUPPORT (3)                  ┃
┃    feedback, helpers, support    ┃
┠────────────────────────────────┨
┃ 🔧 TOOLS (10)                   ┃
┃    calculate, fancy, genpass,   ┃
┃    getpp, qrcode, say, ssweb,   ┃
┃    sticker, tinyurl, tourl       ┃
┠────────────────────────────────┨
┃ 🌐 TRANSLATE (1)                ┃
┃    translate                     ┃
┠────────────────────────────────┨
┃ 🎬 VIDEO (3)                    ┃
┃    toaudio, toimage, tovideo     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

  const footer = `
╔══════════════════════════════════╗
║  Total Commands: ${totalCommands}               ║
║  Type .help <command> for usage  ║
║  Support: ${config.SUPPORT_GROUP} ║
╚══════════════════════════════════╝`;

  return logoCard + "\n" + infoCard + "\n" + commandsCard + "\n" + footer;
}

module.exports = { buildMenu };
