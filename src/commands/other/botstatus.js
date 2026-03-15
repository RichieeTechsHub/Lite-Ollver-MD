module.exports = {
  name: "botstatus",
  description: "Show bot system status",

  async execute({ reply, settings, config }) {

    const uptime = process.uptime();

    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const status = [
      "┏▣ ◈ *LITE-OLLVER-MD* ◈",
      `┃ *Owner:* ${settings.ownerName || config.OWNER_NAME}`,
      `┃ *Prefix:* ${settings.prefix}`,
      `┃ *Mode:* ${settings.mode}`,
      `┃ *Runtime:* ${hours}h ${minutes}m ${seconds}s`,
      `┃ *Platform:* Heroku`,
      `┃ *Memory:* ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
      "┗▣"
    ].join("\n");

    await reply(status);

  }
};