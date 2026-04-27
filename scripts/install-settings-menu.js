const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(dir, { recursive: true });

const commands = [
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
  "testgoodbye","testwelcome"
];

function makeCommand(name) {
  if (name === "getsettings" || name === "statussettings") {
    return `const { readSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  const settings = await readSettings();

  await sock.sendMessage(msg.key.remoteJid, {
    text: "⚙️ *BOT SETTINGS*\\n\\n" + JSON.stringify(settings, null, 2)
  });
}

module.exports = {
  name: "${name}",
  description: "Show bot settings",
  execute
};
`;
  }

  if (name === "resetsetting") {
    return `const { writeSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  await writeSettings({});

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ All bot settings reset."
  });
}

module.exports = {
  name: "resetsetting",
  description: "Reset settings",
  execute
};
`;
  }

  if (name.startsWith("set")) {
    return `const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .${name} value"
    });
  }

  await setSetting("${name}", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *${name}* updated to:\\n" + value
  });
}

module.exports = {
  name: "${name}",
  description: "${name} setting",
  execute
};
`;
  }

  if (name.startsWith("show") || name.startsWith("test") || name.startsWith("list")) {
    return `const { readSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  const settings = await readSettings();
  const value = settings["${name.replace(/^show|^test|^list/, "set")}"] || "Not set";

  await sock.sendMessage(msg.key.remoteJid, {
    text: "⚙️ *${name}*\\n\\n" + value
  });
}

module.exports = {
  name: "${name}",
  description: "${name} command",
  execute
};
`;
  }

  if (name.startsWith("del") || name.startsWith("delete")) {
    return `const { readSettings, writeSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  const settings = await readSettings();
  delete settings["${name}"];
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *${name}* cleared."
  });
}

module.exports = {
  name: "${name}",
  description: "${name} clear command",
  execute
};
`;
  }

  if (name.startsWith("add")) {
    return `const { readSettings, writeSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .${name} value"
    });
  }

  const settings = await readSettings();
  if (!Array.isArray(settings["${name}"])) settings["${name}"] = [];
  settings["${name}"].push(value);
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ Added to *${name}*:\\n" + value
  });
}

module.exports = {
  name: "${name}",
  description: "${name} add command",
  execute
};
`;
  }

  return `const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *${name}*\\n\\nUsage: .${name} on/off\\nCurrent: " + (settings["${name}"] ? "ON" : "OFF")
    });
  }

  await setSetting("${name}", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *${name}* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "${name}",
  description: "${name} toggle command",
  execute
};
`;
}

for (const name of commands) {
  fs.writeFileSync(path.join(dir, name + ".js"), makeCommand(name));
}

console.log("✅ SETTINGS MENU commands injected successfully.");
