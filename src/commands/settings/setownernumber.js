const { updateSetting, cleanNumber } = require("../../utils/settings");

module.exports = {
  name: "setownernumber",
  alias: [],
  description: "Set owner number",

  async execute({ args, reply }) {
    const value = cleanNumber(args.join(" "));

    if (!value || value.length < 10) {
      return reply("Usage: .setownernumber 254740479599");
    }

    await updateSetting("ownerNumber", value);
    await reply(`✅ Owner number updated to: ${value}`);
  }
};