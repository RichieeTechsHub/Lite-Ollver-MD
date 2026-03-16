const { updateSetting } = require("../../utils/settings");

module.exports = {
  name: "setstatusemoji",
  alias: [],
  description: "Set emoji used for status reactions",

  async execute({ args, reply }) {
    const value = args.join(" ").trim();

    if (!value) {
      return reply("Usage: .setstatusemoji ✅");
    }

    await updateSetting("statusEmoji", value);
    await reply(`✅ Status emoji updated to: ${value}`);
  }
};