const config = require("../../config");
const { sendMenuWithLogo } = require("../commands/menu");

function normalizeNumber(num = "") {
  return String(num).replace(/\D/g, "");
}

function extractText(msg) {
  return (
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption ||
    msg.message?.buttonsResponseMessage?.selectedButtonId ||
    msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    msg.message?.templateButtonReplyMessage?.selectedId ||
    msg.message?.ephemeralMessage?.message?.conversation ||
    msg.message?.ephemeralMessage?.message?.extendedTextMessage?.text ||
    msg.message?.ephemeralMessage?.message?.imageMessage?.caption ||
    msg.message?.ephemeralMessage?.message?.videoMessage?.caption ||
    ""
  ).trim();
}

async function sendStartupMessage(sock) {
  try {
    const selfId = sock.user?.id || "";
    const selfNumber = normalizeNumber(selfId.split(":")[0].split("@")[0]);
    const selfJid = `${selfNumber}@s.whatsapp.net`;

    const startupMessage = `✅ *${config.BOT_NAME}* connected successfully

👑 Owner: ${config.OWNER_NAME}
🔣 Prefix: ${config.PREFIX}
🌍 Mode: ${config.MODE}

📥 Bot is active in this inbox.
Send *.ping* or *.menu* to test.`;

    await sock.sendMessage(selfJid, { text: startupMessage });
    console.log("✅ Startup message sent to hosted number");
  } catch (error) {
    console.log("⚠️ Could not send startup message:", error.message);
  }
}

async function handleMessages(sock, msg) {
  try {
    const from = msg.key?.remoteJid || "";
    const sender = msg.key?.participant || from;
    const isGroup = from.endsWith("@g.us");
    const senderNumber = normalizeNumber(sender.split("@")[0]);
    const ownerNumber = normalizeNumber(config.OWNER_NUMBER);
    const isOwner = senderNumber === ownerNumber || msg.key?.fromMe === true;

    if (from === "status@broadcast") return;

    const text = extractText(msg);

    console.log(
      "📨 HANDLER:",
      JSON.stringify({
        from,
        senderNumber,
        fromMe: !!msg.key?.fromMe,
        isGroup,
        text
      })
    );

    if (!text) return;
    if (!text.startsWith(config.PREFIX)) return;

    const args = text.slice(config.PREFIX.length).trim().split(/\s+/);
    const command = (args.shift() || "").toLowerCase();

    console.log(`⚡ Command detected: ${command}`);

    if (config.MODE === "private" && !isOwner && !isGroup) {
      await sock.sendMessage(
        from,
        { text: "🔒 Bot is in private mode. Only owner and groups can use commands." },
        { quoted: msg }
      );
      return;
    }

    if (command === "ping") {
      await sock.sendMessage(
        from,
        { text: "🏓 Pong! Command pipeline is working." },
        { quoted: msg }
      );
      console.log("✅ Replied to ping");
      return;
    }

    if (command === "alive") {
      await sock.sendMessage(
        from,
        {
          text: `✅ *${config.BOT_NAME}* is alive.\n👑 Owner: ${config.OWNER_NAME}\n🔣 Prefix: ${config.PREFIX}`
        },
        { quoted: msg }
      );
      console.log("✅ Replied to alive");
      return;
    }

    if (command === "menu" || command === "help") {
      try {
        await sendMenuWithLogo(sock, from, msg);
        console.log("✅ Replied with menu");
      } catch (e) {
        await sock.sendMessage(
          from,
          { text: "✅ Menu command detected, but menu renderer failed." },
          { quoted: msg }
        );
        console.log("❌ Menu renderer failed:", e.message);
      }
      return;
    }

    await sock.sendMessage(
      from,
      { text: `✅ Command detected: ${command}` },
      { quoted: msg }
    );
    console.log(`✅ Fallback reply sent for: ${command}`);
  } catch (error) {
    console.error("❌ Handler error:", error);
  }
}

module.exports = { handleMessages, sendStartupMessage };
