const { updateSetting, parseToggle, formatBool, getSettings } = require("../../utils/settings");

module.exports = {
  name: "autotyping",
  alias: [],
  description: "Toggle autotyping on or off",

  async execute({ args, reply }) {
    const value = parseToggle(args[0] || "");

    if (value === null) {
      const s = await getSettings();
      return reply(`Usage: .autotyping on/off\nCurrent: ${formatBool(s.autotyping)}`);
    }

    await updateSetting("autotyping", value);
    await reply(`✅ AutoTyping is now ${formatBool(value)}`);
  }
};