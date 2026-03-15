module.exports = {
  name: "statussettings",
  description: "Show status automation settings",

  async execute({ reply, settings }) {
    const text = [
      "📡 *Status Settings*",
      "",
      `*Autoread Status:* ${settings.autoreadstatus}`,
      `*Autoreact Status:* ${settings.autoreactstatus}`,
      `*Status Emoji:* ${settings.statusEmoji}`,
      `*Status Delay:* ${settings.statusDelay}`
    ].join("\n");

    await reply(text);
  }
};