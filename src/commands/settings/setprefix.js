const { updateSetting } = require("../../utils/settings");

module.exports = {
  name: "setprefix",
  alias: [],
  description: "Set bot prefix",

  async execute({ args, reply }) {
    const value = (args[0] || "").trim();

    if (!value) {
      return reply("Usage: .setprefix !");
    }

    if (value.length > 3) {
      return reply("❌ Prefix should be short. Example: ., !, #");
    }

    await updateSetting("prefix", value);
    await reply(`✅ Prefix updated to: ${value}`);
  }
};