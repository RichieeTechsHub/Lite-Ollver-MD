const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const sharp = require("sharp");

async function execute(sock, msg) {
  try {
    const quotedInfo = msg.message?.extendedTextMessage?.contextInfo;
    const quoted = quotedInfo?.quotedMessage;

    if (!quoted?.imageMessage) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Reply to an image with .remini"
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

    const enhanced = await sharp(buffer)
      .resize({ width: 1600, withoutEnlargement: false })
      .sharpen()
      .modulate({ brightness: 1.05, saturation: 1.1 })
      .jpeg({ quality: 95 })
      .toBuffer();

    await sock.sendMessage(msg.key.remoteJid, {
      image: enhanced,
      caption: "✨ Image enhanced."
    });
  } catch {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Remini enhancement failed."
    });
  }
}

module.exports = {
  name: "remini",
  description: "Enhance image",
  execute
};
