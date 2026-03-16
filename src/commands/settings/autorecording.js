const { updateSetting, parseToggle, formatBool, getSettings } = require("../../utils/settings");

module.exports = {
  name: "autorecording",
  alias: ["autorecord"],
  description: "Toggle autorecording on or off",

  async execute({ args, reply }) {
    const value = parseToggle(args[0] || "");

    if (value === null) {
      const s = await getSettings();
      return reply(`Usage: .autorecording on/off\nCurrent: ${formatBool(s.autorecording)}`);
    }

    await updateSetting("autorecording", value);
    await reply(`✅ AutoRecording is now ${formatBool(value)}`);
  }
};