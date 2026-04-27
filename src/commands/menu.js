const os = require("os");

function safeConfig() {
  try {
    return require("../../config");
  } catch {
    return {};
  }
}

const config = safeConfig();

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
    percent,
  };
}

function buildMenu(context) {
  const ram = getRamUsage();
  const uptime = getUptime();

  const commandNames = Array.isArray(context.COMMAND_NAMES)
    ? context.COMMAND_NAMES
    : [];

  const totalCommands = context.COMMANDS_COUNT || commandNames.length || 0;
  const ownerName = config.OWNER_NAME || "RichieeTheeGoat";
  const ownerNumber = config.OWNER_NUMBER || context.OWNER_NUMBER || "254740479599";

  const commandList = commandNames.length
    ? commandNames
        .sort()
        .map((cmd) => `║ ➤ ${context.PREFIX}${cmd}`)
        .join("\n")
    : `║ ➤ ${context.PREFIX}menu\n║ ➤ ${context.PREFIX}owner`;

  return `╔══════════════════════════════════╗
║       ⚡ ${context.BOT_NAME} ⚡
║     WhatsApp Multi-Device Bot
╚══════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃            BOT INFO
┠────────────────────────────────┨
┃ 👑 Owner   : ${ownerName}
┃ 🤖 Bot     : ${context.BOT_NAME}
┃ 🔣 Prefix  : ${context.PREFIX}
┃ 📦 Plugins : ${totalCommands}
┃ ⏱️ Uptime  : ${uptime}
┃ 💾 RAM     : ${ram.used}GB/${ram.total}GB (${ram.percent}%)
┃ 📱 Number  : ${ownerNumber}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

╔══════════════════════════════════╗
║        AVAILABLE COMMANDS
╠══════════════════════════════════╣
${commandList}
╚══════════════════════════════════╝

📌 Total Commands: ${totalCommands}`;
}

async function execute(sock, msg, args, context) {
  const menuText = buildMenu(context);

  await sock.sendMessage(msg.key.remoteJid, {
    text: menuText,
  });

  console.log("✅ Menu sent");
}

module.exports = {
  name: "menu",
  description: "Show the main bot menu",
  execute,
};
