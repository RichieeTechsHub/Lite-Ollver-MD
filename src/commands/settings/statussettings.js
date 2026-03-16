const { getSettings, formatBool } = require("../../utils/settings");

module.exports = {
  name: "statussettings",
  alias: [],
  description: "Show status-related settings",

  async execute({ reply }) {
    const s = await getSettings();

    const text = [
      "┏▣ ◈ *STATUS SETTINGS* ◈",
      `┃ AutoReadStatus: ${formatBool(s.autoreadstatus)}`,
      `┃ AutoReactStatus: ${formatBool(s.autoreactstatus)}`,
      `┃ Status Emoji: ${s.statusEmoji}`,
      `┃ Status Delay: ${s.statusDelay}s`,
      "┗▣"
    ].join("\n");

    await reply(text);
  }
};