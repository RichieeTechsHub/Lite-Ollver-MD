const { updateSetting, parseToggle, formatBool, getSettings } = require("../../utils/settings");

module.exports = {
  name: "chatbot",
  alias: [],
  description: "Toggle chatbot on or off",

  async execute({ args, reply }) {
    const value = parseToggle(args[0] || "");

    if (value === null) {
      const s = await getSettings();
      return reply(`Usage: .chatbot on/off\nCurrent: ${formatBool(s.chatbot)}`);
    }

    await updateSetting("chatbot", value);
    await reply(`✅ Chatbot is now ${formatBool(value)}`);
  }
};