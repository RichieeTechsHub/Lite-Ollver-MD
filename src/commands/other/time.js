module.exports = {
  name: "time",
  description: "Show current bot time",

  async execute({ reply, settings, config }) {
    const now = new Date().toLocaleString("en-KE", {
      timeZone: settings.timezone || config.TIMEZONE
    });

    await reply(`🕒 *Current Time*\n\n${now}`);
  }
};