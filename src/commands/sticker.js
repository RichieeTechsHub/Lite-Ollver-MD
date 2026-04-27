const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

async function execute(sock, msg) {
  try {
    const quotedInfo = msg.message?.extendedTextMessage?.contextInfo;
    const quoted = quotedInfo?.quotedMessage;

    if (!quoted?.imageMessage) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Reply to an image with .sticker"
      });
    }

    const quotedMsg = {
      key: {
        remoteJid: msg.key.remoteJid,
        id: quotedInfo.stanzaId,
        participant: quotedInfo.participant
      },
      message: quoted
    };

    const buffer = await downloadMediaMessage(
      quotedMsg,
      "buffer",
      {},
      { logger: console, reuploadRequest: sock.updateMediaMessage }
    );

    const webp = await sharp(buffer)
      .resize(512, 512, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .webp()
      .toBuffer();

    await sock.sendMessage(msg.key.remoteJid, {
      sticker: webp
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Failed to create sticker."
    });
  }
}

module.exports = {
  name: "sticker",
  description: "Create sticker from image",
  execute
};
