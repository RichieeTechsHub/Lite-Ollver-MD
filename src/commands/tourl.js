const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const axios = require("axios");
const FormData = require("form-data");

async function execute(sock, msg) {
  try {
    const quotedInfo = msg.message?.extendedTextMessage?.contextInfo;
    const quoted = quotedInfo?.quotedMessage;

    if (!quoted) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Reply to media/document with .tourl"
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

    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", buffer, {
      filename: "lite-ollver-media.bin"
    });

    const res = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
      timeout: 60000
    });

    await sock.sendMessage(msg.key.remoteJid, {
      text: "🔗 *Uploaded URL:*\n\n" + res.data
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Upload failed. Try again later."
    });
  }
}

module.exports = {
  name: "tourl",
  description: "Upload media and return URL",
  execute
};
