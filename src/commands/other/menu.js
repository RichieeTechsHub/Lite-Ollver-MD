const fs = require("fs");
const path = require("path");
const { buildMainMenu } = require("../../bot/menu");
const { getSettings } = require("../../utils/settings");

module.exports = {
  name: "menu",
  alias: ["help"],
  description: "Show full bot menu",

  async execute({ sock, msg, config, reply }) {
    try {
      const liveSettings = await getSettings();
      const logoPath = path.join(process.cwd(), "assets", "logo.png");

      const menuText = buildMainMenu({
        ownerName: liveSettings.ownerName || config.OWNER_NAME,
        prefix: liveSettings.prefix || config.PREFIX,
        mode: liveSettings.mode || config.MODE,
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
      console.error("Menu command error:", error.message);
      await reply("❌ Failed to load menu.");
    }
  }
};