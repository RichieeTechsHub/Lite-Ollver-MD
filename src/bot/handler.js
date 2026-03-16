const fs = require("fs");
const path = require("path");
const config = require("../../config");
const {
  getSettings,
  updateSetting,
  parseToggle,
  formatBool,
  cleanNumber
} = require("../utils/settings");
const { buildMainMenu } = require("./menu");

async function replyText(sock, msg, text) {
  await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
}

async function sendMenu(sock, msg, settings) {
  const menuText = buildMainMenu({
    ownerName: settings.ownerName || config.OWNER_NAME,
    prefix: settings.prefix || config.PREFIX,
    mode: settings.mode || config.MODE,
    version: config.VERSION || "1.0.0",
    host: "Heroku",
    speed: "0.2100"
  });

  const logoPath = path.join(process.cwd(), "assets", "logo.png");

  if (fs.existsSync(logoPath)) {
    const imageBuffer = fs.readFileSync(logoPath);
    await sock.sendMessage(
      msg.key.remoteJid,
      {
        image: imageBuffer,
        caption: menuText
      },
      { quoted: msg }
    );
    return;
  }

  await replyText(sock, msg, menuText);
}

async function sendOwnerConnectedMessage(sock, runtimeStart) {
  try {
    const settings = await getSettings();
    const myJid = sock.user?.id;

    if (!myJid) {
      console.log("❌ Could not detect bot JID for startup message.");
      return;
    }

    const ownerName = settings.ownerName || config.OWNER_NAME || "Owner";
    const ownerNumber = settings.ownerNumber || config.OWNER_NUMBER || "";
    const prefix = settings.prefix || config.PREFIX || ".";
    const speed = `${Date.now() - runtimeStart} ms`;

    const caption = [
      "╭━━━〔 *ELITE-OLLVER-MD* 〕━━━╮",
      "✅ Connected Successfully",
      "",
      `⚡ Speed: ${speed}`,
      `🔣 Prefix: ${prefix}`,
      `👑 Owner: ${ownerName}`,
      `📱 Owner Number: ${ownerNumber}`,
      "",
      "Bot is now active in your inbox.",
      "╰━━━━━━━━━━━━━━━━━━━━━━╯"
    ].join("\n");

    const logoPath = path.join(process.cwd(), "assets", "logo.png");

    const trySend = async (attempt = 1) => {
      try {
        if (fs.existsSync(logoPath)) {
          const imageBuffer = fs.readFileSync(logoPath);
          await sock.sendMessage(myJid, {
            image: imageBuffer,
            caption
          });
        } else {
          await sock.sendMessage(myJid, { text: caption });
        }

        console.log(`✅ Startup message sent successfully on attempt ${attempt}`);
      } catch (error) {
        console.log(`⚠️ Startup message failed on attempt ${attempt}: ${error.message}`);
        if (attempt < 3) {
          setTimeout(() => {
            trySend(attempt + 1);
          }, 4000);
        }
      }
    };

    setTimeout(() => {
      trySend(1);
    }, 6000);
  } catch (error) {
    console.error("❌ Failed to prepare startup message:", error.message);
  }
}

async function handleIncomingMessages(sock, messageEvent) {
  try {
    const msg = messageEvent?.messages?.[0];
    if (!msg || !msg.message) return;

    const settings = await getSettings();

    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      msg.message.videoMessage?.caption ||
      "";

    if (!body) return;

    const prefix = settings.prefix || config.PREFIX || ".";
    if (!body.startsWith(prefix)) return;

    const args = body.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();
    const argText = args.join(" ").trim();

    if (!command) return;

    if (command === "ping") {
      return await replyText(sock, msg, "Pong 🔎");
    }

    if (command === "repo") {
      return await replyText(
        sock,
        msg,
        "🌐 Repo: https://github.com/RichieeTechsHub/Lite-Ollver-MD"
      );
    }

    if (command === "alive") {
      return await replyText(
        sock,
        msg,
        `✅ *${settings.botName || config.BOT_NAME}* is active.\n👑 Owner: ${settings.ownerName}\n📱 Owner Number: ${settings.ownerNumber}\n🔣 Prefix: ${settings.prefix}\n🌍 Mode: ${settings.mode}`
      );
    }

    if (command === "menu" || command === "help") {
      return await sendMenu(sock, msg, settings);
    }

    if (command === "owner") {
      return await replyText(
        sock,
        msg,
        `👑 Owner: ${settings.ownerName}\n📱 Number: ${settings.ownerNumber}`
      );
    }

    if (command === "getsettings" || command === "settings") {
      const text = [
        "┏▣ ◈ *CURRENT SETTINGS* ◈",
        `┃ Bot Name: ${settings.botName}`,
        `┃ Owner Name: ${settings.ownerName}`,
        `┃ Owner Number: ${settings.ownerNumber}`,
        `┃ Prefix: ${settings.prefix}`,
        `┃ Mode: ${settings.mode}`,
        `┃ Timezone: ${settings.timezone}`,
        `┃ Chatbot: ${formatBool(settings.chatbot)}`,
        `┃ AutoTyping: ${formatBool(settings.autotyping)}`,
        `┃ AutoRecording: ${formatBool(settings.autorecording)}`,
        `┃ AutoReadStatus: ${formatBool(settings.autoreadstatus)}`,
        `┃ AutoReactStatus: ${formatBool(settings.autoreactstatus)}`,
        `┃ Status Emoji: ${settings.statusEmoji}`,
        `┃ Status Delay: ${settings.statusDelay}s`,
        `┃ Menu Image: ${settings.menuImage || "Not set"}`,
        "┗▣"
      ].join("\n");

      return await replyText(sock, msg, text);
    }

    if (command === "mode") {
      const value = String(args[0] || "").toLowerCase();
      if (!["public", "private"].includes(value)) {
        return await replyText(sock, msg, "Usage: .mode public OR .mode private");
      }

      await updateSetting("mode", value);
      return await replyText(sock, msg, `✅ Bot mode updated to: ${value}`);
    }

    if (command === "setprefix") {
      const value = String(args[0] || "").trim();
      if (!value) {
        return await replyText(sock, msg, "Usage: .setprefix !");
      }

      await updateSetting("prefix", value);
      return await replyText(sock, msg, `✅ Prefix updated to: ${value}`);
    }

    if (command === "setbotname") {
      if (!argText) {
        return await replyText(sock, msg, "Usage: .setbotname Elite-Ollver-MD");
      }

      await updateSetting("botName", argText);
      return await replyText(sock, msg, `✅ Bot name updated to: ${argText}`);
    }

    if (command === "setownername") {
      if (!argText) {
        return await replyText(sock, msg, "Usage: .setownername RichiieeTheeGoat");
      }

      await updateSetting("ownerName", argText);
      return await replyText(sock, msg, `✅ Owner name updated to: ${argText}`);
    }

    if (command === "setownernumber") {
      const value = cleanNumber(argText);
      if (!value || value.length < 10) {
        return await replyText(sock, msg, "Usage: .setownernumber 254740479599");
      }

      await updateSetting("ownerNumber", value);
      return await replyText(sock, msg, `✅ Owner number updated to: ${value}`);
    }

    if (command === "setstatusemoji") {
      if (!argText) {
        return await replyText(sock, msg, "Usage: .setstatusemoji ✅");
      }

      await updateSetting("statusEmoji", argText);
      return await replyText(sock, msg, `✅ Status emoji updated to: ${argText}`);
    }

    if (command === "settimezone") {
      if (!argText) {
        return await replyText(sock, msg, "Usage: .settimezone Africa/Nairobi");
      }

      await updateSetting("timezone", argText);
      return await replyText(sock, msg, `✅ Timezone updated to: ${argText}`);
    }

    if (command === "statusdelay") {
      const value = Number(args[0]);
      if (!value || Number.isNaN(value) || value < 1) {
        return await replyText(sock, msg, "Usage: .statusdelay 5");
      }

      await updateSetting("statusDelay", value);
      return await replyText(sock, msg, `✅ Status delay updated to: ${value} seconds`);
    }

    if (command === "statussettings") {
      const text = [
        "┏▣ ◈ *STATUS SETTINGS* ◈",
        `┃ AutoReadStatus: ${formatBool(settings.autoreadstatus)}`,
        `┃ AutoReactStatus: ${formatBool(settings.autoreactstatus)}`,
        `┃ Status Emoji: ${settings.statusEmoji}`,
        `┃ Status Delay: ${settings.statusDelay}s`,
        "┗▣"
      ].join("\n");

      return await replyText(sock, msg, text);
    }

    if (command === "autotyping") {
      const value = parseToggle(args[0] || "");
      if (value === null) {
        return await replyText(sock, msg, `Usage: .autotyping on/off\nCurrent: ${formatBool(settings.autotyping)}`);
      }

      await updateSetting("autotyping", value);
      return await replyText(sock, msg, `✅ AutoTyping is now ${formatBool(value)}`);
    }

    if (command === "autorecording" || command === "autorecord") {
      const value = parseToggle(args[0] || "");
      if (value === null) {
        return await replyText(sock, msg, `Usage: .autorecording on/off\nCurrent: ${formatBool(settings.autorecording)}`);
      }

      await updateSetting("autorecording", value);
      return await replyText(sock, msg, `✅ AutoRecording is now ${formatBool(value)}`);
    }

    if (command === "autoreadstatus") {
      const value = parseToggle(args[0] || "");
      if (value === null) {
        return await replyText(sock, msg, `Usage: .autoreadstatus on/off\nCurrent: ${formatBool(settings.autoreadstatus)}`);
      }

      await updateSetting("autoreadstatus", value);
      return await replyText(sock, msg, `✅ AutoReadStatus is now ${formatBool(value)}`);
    }

    if (command === "autoreactstatus") {
      const value = parseToggle(args[0] || "");
      if (value === null) {
        return await replyText(sock, msg, `Usage: .autoreactstatus on/off\nCurrent: ${formatBool(settings.autoreactstatus)}`);
      }

      await updateSetting("autoreactstatus", value);
      return await replyText(sock, msg, `✅ AutoReactStatus is now ${formatBool(value)}`);
    }

    if (command === "chatbot") {
      const value = parseToggle(args[0] || "");
      if (value === null) {
        return await replyText(sock, msg, `Usage: .chatbot on/off\nCurrent: ${formatBool(settings.chatbot)}`);
      }

      await updateSetting("chatbot", value);
      return await replyText(sock, msg, `✅ Chatbot is now ${formatBool(value)}`);
    }

    if (command === "setmenuimage") {
      if (!argText) {
        return await replyText(sock, msg, "Usage: .setmenuimage https://example.com/logo.jpg");
      }

      await updateSetting("menuImage", argText);
      return await replyText(sock, msg, `✅ Menu image updated:\n${argText}`);
    }
  } catch (error) {
    console.error("❌ Handler crashed:", error.message);
  }
}

module.exports = {
  handleIncomingMessages,
  sendOwnerConnectedMessage
};