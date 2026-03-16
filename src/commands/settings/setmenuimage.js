const { updateSetting } = require("../../utils/settings");

module.exports = {
  name: "setmenuimage",
  alias: [],
  description: "Set menu image URL",

  async execute({ args, reply }) {
    const value = args.join(" ").trim();

    if (!value) {
      return reply("Usage: .setmenuimage https://example.com/logo.jpg");
    }

    await updateSetting("menuImage", value);
    await reply(`✅ Menu image updated:\n${value}`);
  }
};