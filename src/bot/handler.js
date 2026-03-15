const fs = require("fs");
const path = require("path");
const config = require("../../config");

async function handleMessages(sock, messageEvent) {
  try {
    const msg = messageEvent.messages[0];
    if (!msg || !msg.message) return;
    if (msg.key.fromMe) return;

    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      msg.message.videoMessage?.caption ||
      "";

    const prefix = config.PREFIX || ".";

    if (!body.startsWith(prefix)) return;

    const args = body.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    const commandsPath = path.join(__dirname, "../commands");

    let commandFiles = [];

    const categories = fs.readdirSync(commandsPath);

    for (const category of categories) {
      const categoryPath = path.join(commandsPath, category);

      if (fs.lstatSync(categoryPath).isDirectory()) {
        const files = fs
          .readdirSync(categoryPath)
          .filter((file) => file.endsWith(".js"));

        for (const file of files) {
          commandFiles.push(path.join(categoryPath, file));
        }
      }
    }

    for (const file of commandFiles) {
      delete require.cache[require.resolve(file)];
      const cmd = require(file);

      if (
        cmd.name === command ||
        (cmd.alias && cmd.alias.includes(command))
      ) {
        const reply = (text) =>
          sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });

        return cmd.execute({
          sock,
          msg,
          args,
          command,
          config,
          reply
        });
      }
    }
  } catch (error) {
    console.error("Handler error:", error);
  }
}

module.exports = { handleMessages };