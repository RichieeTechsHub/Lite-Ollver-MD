const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const sharp = require("sharp");

async function execute(sock, msg) {
  try {
    const quotedInfo = msg.message?.extendedTextMessage?.contextInfo;
    const quoted = quotedInfo?.quotedMessage;

    if (!quoted?.stickerMessage) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Reply to a sticker with .toimage"
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

    const png = await sharp(buffer).png().toBuffer();

    await sock.sendMessage(msg.key.remoteJid, {
      image: png,
      caption: "✅ Sticker converted to image."
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Failed to convert sticker to image."
    });
  }
}

module.exports = {
  name: "toimage",
  description: "Convert sticker to image",
  execute
};
