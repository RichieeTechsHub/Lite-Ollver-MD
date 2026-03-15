module.exports = {
  name: "getsettings",
  description: "Show current bot settings",

  async execute({ reply, settings }) {
    const text = [
      "⚙️ *Lite-Ollver-MD Settings*",
      "",
      `*Bot Name:* ${settings.botName}`,
      `*Owner Name:* ${settings.ownerName}`,
      `*Owner Number:* ${settings.ownerNumber}`,
      `*Mode:* ${settings.mode}`,
      `*Prefix:* ${settings.prefix}`,
      `*Timezone:* ${settings.timezone}`,
      `*Autotyping:* ${settings.autotyping}`,
      `*Autorecording:* ${settings.autorecording}`,
      `*Autoread Status:* ${settings.autoreadstatus}`,
      `*Autoreact Status:* ${settings.autoreactstatus}`,
      `*Status Emoji:* ${settings.statusEmoji}`,
      `*Status Delay:* ${settings.statusDelay}`
    ].join("\n");

    await reply(text);
  }
};