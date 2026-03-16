const { getSettings, formatBool } = require("../../utils/settings");

module.exports = {
  name: "getsettings",
  alias: ["settings"],
  description: "Show current bot settings",

  async execute({ reply }) {
    const s = await getSettings();

    const text = [
      "┏▣ ◈ *CURRENT SETTINGS* ◈",
      `┃ Bot Name: ${s.botName}`,
      `┃ Owner Name: ${s.ownerName}`,
      `┃ Owner Number: ${s.ownerNumber}`,
      `┃ Prefix: ${s.prefix}`,
      `┃ Mode: ${s.mode}`,
      `┃ Timezone: ${s.timezone}`,
      `┃ Chatbot: ${formatBool(s.chatbot)}`,
      `┃ AutoTyping: ${formatBool(s.autotyping)}`,
      `┃ AutoRecording: ${formatBool(s.autorecording)}`,
      `┃ AutoReadStatus: ${formatBool(s.autoreadstatus)}`,
      `┃ AutoReactStatus: ${formatBool(s.autoreactstatus)}`,
      `┃ Status Emoji: ${s.statusEmoji}`,
      `┃ Status Delay: ${s.statusDelay}s`,
      `┃ Menu Image: ${s.menuImage || "Not set"}`,
      "┗▣"
    ].join("\n");

    await reply(text);
  }
};