const fs = require("fs");
const path = require("path");
const { buildMainMenu } = require("../../bot/menu");

module.exports = {
  name: "menu",
  alias: ["help"],
  description: "Show full bot menu",

  async execute({ sock, msg, settings, config, reply }) {
    try {
      const logoPath = path.join(process.cwd(), "assets", "logo.png");

      const menuText = buildMainMenu({
        ownerName: settings?.ownerName || config.OWNER_NAME,
        prefix: settings?.prefix || config.PREFIX,
        mode: settings?.mode || config.MODE,
        version: config.VERSION,
        host: "Heroku",
        speed: "0.2100"
      });

      if (fs.existsSync(logoPath)) {
        const imageBuffer = fs.readFileSync(logoPath);

        await sock.sendMessage(
          msg.key.remoteJid,
          {
            image: imageBuffer,
            caption: menuText
          },
          { quoted: msg }
        );
        return;
      }

      await reply(menuText);
    } catch (error) {
      console.error("Menu command error:", error);
      await reply("❌ Failed to load menu.");
    }
  }
};