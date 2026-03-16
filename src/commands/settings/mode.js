const { updateSetting } = require("../../utils/settings");

module.exports = {
  name: "mode",
  alias: [],
  description: "Set bot mode: public/private",

  async execute({ args, reply }) {
    const value = String(args[0] || "").toLowerCase();

    if (!["public", "private"].includes(value)) {
      return reply("Usage: .mode public OR .mode private");
    }

    await updateSetting("mode", value);
    await reply(`✅ Bot mode updated to: ${value}`);
  }
};