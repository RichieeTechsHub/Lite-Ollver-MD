module.exports = {
  name: "repo",
  description: "Show repository information",

  async execute({ reply }) {
    await reply(
      "📦 *Lite-Ollver-MD Repository*\n\nAdd your GitHub repo link here after uploading the project."
    );
  }
};