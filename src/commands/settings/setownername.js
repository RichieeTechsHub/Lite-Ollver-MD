const { updateSetting } = require("../../utils/settings");

module.exports = {
  name: "setownername",
  alias: [],
  description: "Set owner name",

  async execute({ args, reply }) {
    const value = args.join(" ").trim();

    if (!value) {
      return reply("Usage: .setownername RichiieeTheeGoat");
    }

    await updateSetting("ownerName", value);
    await reply(`✅ Owner name updated to: ${value}`);
  }
};