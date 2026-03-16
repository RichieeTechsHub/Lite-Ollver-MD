const { updateSetting } = require("../../utils/settings");

module.exports = {
  name: "statusdelay",
  alias: [],
  description: "Set status delay in seconds",

  async execute({ args, reply }) {
    const value = Number(args[0]);

    if (!value || Number.isNaN(value) || value < 1) {
      return reply("Usage: .statusdelay 5");
    }

    await updateSetting("statusDelay", value);
    await reply(`✅ Status delay updated to: ${value} seconds`);
  }
};