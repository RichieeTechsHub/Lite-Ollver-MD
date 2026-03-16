const { updateSetting, parseToggle, formatBool, getSettings } = require("../../utils/settings");

module.exports = {
  name: "autoreactstatus",
  alias: [],
  description: "Toggle autoreactstatus on or off",

  async execute({ args, reply }) {
    const value = parseToggle(args[0] || "");

    if (value === null) {
      const s = await getSettings();
      return reply(`Usage: .autoreactstatus on/off\nCurrent: ${formatBool(s.autoreactstatus)}`);
    }

    await updateSetting("autoreactstatus", value);
    await reply(`✅ AutoReactStatus is now ${formatBool(value)}`);
  }
};