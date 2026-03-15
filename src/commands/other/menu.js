const { buildMainMenu } = require("../../bot/menu");

module.exports = {
  name: "menu",
  description: "Show the main bot menu",

  async execute({ reply, settings, config }) {
    const menuText = buildMainMenu({
      ownerName: settings.ownerName || config.OWNER_NAME,
      prefix: settings.prefix || config.PREFIX,
      mode: settings.mode || config.MODE,
      version: config.VERSION,
      host: "Heroku",
      speed: "0.2100"
    });

    await reply(menuText);
  }
};