const { updateSetting } = require("../../utils/settings");

module.exports = {
  name: "settimezone",
  alias: [],
  description: "Set timezone",

  async execute({ args, reply }) {
    const value = args.join(" ").trim();

    if (!value) {
      return reply("Usage: .settimezone Africa/Nairobi");
    }

    await updateSetting("timezone", value);
    await reply(`✅ Timezone updated to: ${value}`);
  }
};