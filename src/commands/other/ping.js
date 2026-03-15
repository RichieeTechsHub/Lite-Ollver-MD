module.exports = {
  name: "ping",
  description: "Check bot response speed",

  async execute({ reply }) {
    const start = Date.now();

    const end = Date.now();
    const speed = end - start;

    await reply(`🏓 Pong!\n\n⚡ Speed: ${speed} ms`);
  }
};