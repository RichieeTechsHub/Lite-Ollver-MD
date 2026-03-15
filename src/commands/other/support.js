module.exports = {
  name: "support",
  description: "Show support group and owner contact",

  async execute({ reply, settings, config }) {

    const text = [
      "╭━━━〔 *LITE-OLLVER-MD SUPPORT* 〕━━━╮",
      "",
      "👥 *Support Group:*",
      settings.supportGroup || config.SUPPORT_GROUP,
      "",
      "👑 *Owner Contact:*",
      settings.ownerContact || config.OWNER_CONTACT,
      "",
      "If you face any issues with the bot",
      "please join the support group.",
      "",
      "╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯"
    ].join("\n")

    await reply(text)

  }
}