module.exports = {
  name: "owner",
  description: "Show owner information",

  async execute({ reply, settings, config }) {
    const ownerText = [
      "👑 *Lite-Ollver-MD Owner*",
      "",
      `*Name:* ${settings.ownerName || config.OWNER_NAME}`,
      `*Number:* ${settings.ownerContact || config.OWNER_CONTACT}`,
      `*Support Group:* ${settings.supportGroup || config.SUPPORT_GROUP}`
    ].join("\n");

    await reply(ownerText);
  }
};