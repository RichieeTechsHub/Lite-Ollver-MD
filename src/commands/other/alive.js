module.exports = {
  name: "alive",
  description: "Check if the bot is alive",

  async execute({ reply, settings, config }) {

    const uptime = process.uptime()

    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)

    const text = [
      "╭━━━〔 *LITE-OLLVER-MD* 〕━━━╮",
      "",
      "✅ Bot is running successfully",
      "",
      `👑 Owner: ${settings.ownerName || config.OWNER_NAME}`,
      `⚙ Mode: ${settings.mode}`,
      `🔣 Prefix: ${settings.prefix}`,
      `⏱ Runtime: ${hours}h ${minutes}m ${seconds}s`,
      "",
      "🚀 Powered by Lite-Ollver-MD",
      "╰━━━━━━━━━━━━━━━━━━━━━━╯"
    ].join("\n")

    await reply(text)

  }
}