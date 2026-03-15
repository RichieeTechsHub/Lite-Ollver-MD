module.exports = {
  name: "runtime",
  description: "Show bot uptime",

  async execute({ reply }) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    await reply(`⏱️ *Runtime*\n\n${hours}h ${minutes}m ${seconds}s`);
  }
};