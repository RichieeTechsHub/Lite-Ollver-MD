const { updateSetting } = require("../../utils/settings");

module.exports = {
  name: "setbotname",
  alias: [],
  description: "Set bot name",

  async execute({ args, reply }) {
    const value = args.join(" ").trim();

    if (!value) {
      return reply("Usage: .setbotname Lite-Ollver-MD");
    }

    await updateSetting("botName", value);
    await reply(`✅ Bot name updated to: ${value}`);
  }
};