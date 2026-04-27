const fs = require("fs-extra");
const path = require("path");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { ensureTemp, runFfmpeg } = require("../lib/audioProcessor");

async function execute(sock, msg) {
  try {
    const quotedInfo = msg.message?.extendedTextMessage?.contextInfo;

    if (!quotedInfo?.quotedMessage) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Reply to an audio/video message with .robot"
      });
    }

    const quotedMsg = {
      key: {
        remoteJid: msg.key.remoteJid,
        id: quotedInfo.stanzaId,
        participant: quotedInfo.participant
      },
      message: quotedInfo.quotedMessage
    };

    const buffer = await downloadMediaMessage(
      quotedMsg,
      "buffer",
      {},
      {
        logger: console,
        reuploadRequest: sock.updateMediaMessage
      }
    );

    const tempDir = await ensureTemp();
    const input = path.join(tempDir, "robot-input-" + Date.now());
    const output = path.join(tempDir, "robot-output-" + Date.now() + ".mp3");

    await fs.writeFile(input, buffer);

    const options = [];
    options.push({ type: "audioFilter", value: "afftfilt=real='hypot(re,im)':imag='0'" });
    options.push({ type: "format", value: "mp3" });

    await runFfmpeg(input, output, options);

    await sock.sendMessage(msg.key.remoteJid, {
      audio: await fs.readFile(output),
      mimetype: "audio/mpeg",
      ptt: false
    });

    await fs.remove(input).catch(() => {});
    await fs.remove(output).catch(() => {});
  } catch (err) {
    console.error("❌ robot error:", err.message);
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ robot failed. Reply to a valid audio/video file."
    });
  }
}

module.exports = {
  name: "robot",
  description: "Robot style audio effect",
  execute
};
