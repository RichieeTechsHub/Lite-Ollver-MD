const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(dir, { recursive: true });

const commands = {
  bass: {
    desc: "Add bass boost to replied audio",
    filter: "bass=g=12"
  },
  blown: {
    desc: "Boost audio loudly",
    filter: "volume=8"
  },
  deep: {
    desc: "Make audio deeper",
    filter: "asetrate=44100*0.8,aresample=44100"
  },
  earrape: {
    desc: "Extreme loud audio effect",
    filter: "volume=15"
  },
  reverse: {
    desc: "Reverse audio",
    filter: "areverse"
  },
  robot: {
    desc: "Robot style audio effect",
    filter: "afftfilt=real='hypot(re,im)':imag='0'"
  },
  tomp3: {
    desc: "Convert replied audio/video to MP3",
    filter: null
  },
  toptt: {
    desc: "Convert replied audio to WhatsApp voice note",
    filter: null
  },
  volaudio: {
    desc: "Increase audio volume",
    filter: "volume=5"
  }
};

function makeCommand(name, data) {
  const filterLine = data.filter
    ? `options.push({ type: "audioFilter", value: "${data.filter.replace(/"/g, '\\"')}" });`
    : "";

  const isPtt = name === "toptt";

  return `const fs = require("fs-extra");
const path = require("path");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { ensureTemp, runFfmpeg } = require("../lib/audioProcessor");

async function execute(sock, msg) {
  try {
    const quotedInfo = msg.message?.extendedTextMessage?.contextInfo;

    if (!quotedInfo?.quotedMessage) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Reply to an audio/video message with .${name}"
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
    const input = path.join(tempDir, "${name}-input-" + Date.now());
    const output = path.join(tempDir, "${name}-output-" + Date.now() + ".mp3");

    await fs.writeFile(input, buffer);

    const options = [];
    ${filterLine}
    options.push({ type: "format", value: "mp3" });

    await runFfmpeg(input, output, options);

    await sock.sendMessage(msg.key.remoteJid, {
      audio: await fs.readFile(output),
      mimetype: "audio/mpeg",
      ptt: ${isPtt}
    });

    await fs.remove(input).catch(() => {});
    await fs.remove(output).catch(() => {});
  } catch (err) {
    console.error("❌ ${name} error:", err.message);
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ ${name} failed. Reply to a valid audio/video file."
    });
  }
}

module.exports = {
  name: "${name}",
  description: "${data.desc}",
  execute
};
`;
}

for (const [name, data] of Object.entries(commands)) {
  fs.writeFileSync(path.join(dir, name + ".js"), makeCommand(name, data));
}

console.log("✅ AUDIO MENU commands injected successfully.");
