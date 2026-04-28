const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const Pino = require("pino");

async function execute(sock, msg) {
  try {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Reply to a status/media message with .savestatus",
      });
    }

    const media =
      quoted.imageMessage ||
      quoted.videoMessage ||
      quoted.audioMessage;

    if (!media) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Reply to an image/video/audio status.",
      });
    }

    const quotedInfo = msg.message.extendedTextMessage.contextInfo;

    const mediaMsgObj = {
      key: {
        remoteJid: msg.key.remoteJid,
        id: quotedInfo.stanzaId,
        participant: quotedInfo.participant,
      },
      message: quoted,
    };

    const buffer = await downloadMediaMessage(
      mediaMsgObj,
      "buffer",
      {},
      { logger: Pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage }
    );

    if (quoted.imageMessage) {
      return sock.sendMessage(msg.key.remoteJid, {
        image: buffer,
        caption: media.caption || "✅ Saved status",
      });
    }

    if (quoted.videoMessage) {
      return sock.sendMessage(msg.key.remoteJid, {
        video: buffer,
        caption: media.caption || "✅ Saved status",
        mimetype: media.mimetype || "video/mp4",
      });
    }

    if (quoted.audioMessage) {
      return sock.sendMessage(msg.key.remoteJid, {
        audio: buffer,
        mimetype: media.mimetype || "audio/ogg",
        ptt: !!media.ptt,
      });
    }
  } catch (err) {
    console.log("Save status error:", err.message);
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Failed to save status/media.",
    });
  }
}

module.exports = {
  name: "savestatus",
  description: "Save replied status/media",
  execute,
};
