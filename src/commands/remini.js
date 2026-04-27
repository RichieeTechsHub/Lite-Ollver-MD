const { downloadMediaMessage } = require("@whiskeysockets/baileys");

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

    await sock.sendMessage(msg.key.remoteJid, {
      image: buffer,
      caption: "✨ Image received. Remini enhancement API will be connected next."
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Remini failed. Reply to a valid image."
    });
  }
}

module.exports = {
  name: "remini",
  description: "Enhance replied image",
  execute
};
