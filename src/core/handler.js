const config = require("../../config");

const menuCmd = require("../commands/menu");
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

const commandModules = [
  menuCmd,
  otherCmd,
  ownerCmd,
  supportCmd,
  toolsCmd,
  aiCmd,
  audioCmd,
  downloadCmd,
  funCmd,
  gamesCmd,
  groupCmd,
  imageCmd,
  religionCmd,
  searchCmd,
  settingsCmd,
  translateCmd,
  videoCmd
];

function unwrapMessage(message = {}) {
  if (message.ephemeralMessage?.message) {
    return unwrapMessage(message.ephemeralMessage.message);
  }

  if (message.viewOnceMessage?.message) {
    return unwrapMessage(message.viewOnceMessage.message);
  }

  if (message.viewOnceMessageV2?.message) {
    return unwrapMessage(message.viewOnceMessageV2.message);
  }

  if (message.documentWithCaptionMessage?.message) {
    return unwrapMessage(message.documentWithCaptionMessage.message);
  }

  return message;
}

function extractText(message = {}) {
  const msg = unwrapMessage(message);

  return (
    msg.conversation ||
    msg.extendedTextMessage?.text ||
    msg.imageMessage?.caption ||
    msg.videoMessage?.caption ||
    msg.documentMessage?.caption ||
    msg.buttonsResponseMessage?.selectedButtonId ||
    msg.listResponseMessage?.singleSelectReply?.selectedRowId ||
    msg.templateButtonReplyMessage?.selectedId ||
    ""
  );
}

async function handleMessages(sock, msg) {
  try {
    const from = msg.key?.remoteJid;
    if (!from) return;
    if (from === "status@broadcast") return;

    const sender = msg.key?.participant || from;
    const isGroup = from.endsWith("@g.us");
    const senderNumber = String(sender || "").split("@")[0];
    const ownerNumber = String(config.OWNER_NUMBER || "").replace(/\D/g, "");
    const cleanSenderNumber = senderNumber.replace(/\D/g, "");
    const isOwner = cleanSenderNumber === ownerNumber;

    const text = extractText(msg.message).trim();
    if (!text) return;

    console.log(`📨 From: ${senderNumber} | Text: ${text}`);

    if (!text.startsWith(config.PREFIX)) return;

    const body = text.slice(config.PREFIX.length).trim();
    if (!body) return;

    const args = body.split(/\s+/);
    const command = (args.shift() || "").toLowerCase();
    const fullArgs = args.join(" ");

    console.log(`⚡ Command detected: ${config.PREFIX}${command}`);

    if (config.MODE === "private" && !isOwner) {
      await sock.sendMessage(
        from,
        { text: "🔒 Bot is in *private mode*. Only the owner can use commands." },
        { quoted: msg }
      );
      return;
    }

    const context = {
      config,
      sock,
      msg,
      from,
      sender,
      senderNumber,
      isOwner,
      isGroup,
      args,
      fullArgs
    };

    for (const mod of commandModules) {
      if (!mod || typeof mod.execute !== "function") continue;

      try {
        const result = await mod.execute(command, context);

        if (result === false || result == null) {
          continue;
        }

        if (typeof result === "string" && result.trim()) {
          await sock.sendMessage(from, { text: result }, { quoted: msg });
          console.log(`✅ Response sent for: ${command}`);
          return;
        }

        if (typeof result === "object") {
          await sock.sendMessage(from, result, { quoted: msg });
          console.log(`✅ Object response sent for: ${command}`);
          return;
        }
      } catch (err) {
        console.error(`❌ Error in module for command "${command}":`, err.message);
      }
    }

    await sock.sendMessage(
      from,
      { text: `❌ Unknown command: *${command}*\nType *${config.PREFIX}menu* to see available commands.` },
      { quoted: msg }
    );
  } catch (error) {
    console.error("❌ Handler error:", error);
  }
}

module.exports = { handleMessages };
