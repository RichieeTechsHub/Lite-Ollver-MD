const axios = require("axios");

async function execute(sock, msg, args) {
  const word = args.join(" ");

  if (!word) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .define word"
    });
  }

  try {
    const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    const def = data[0].meanings[0].definitions[0].definition;

    await sock.sendMessage(msg.key.remoteJid, {
      text: `📖 *${word}*\n\n${def}`
    });

  } catch {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Word not found."
    });
  }
}

module.exports = { name: "define", execute };
