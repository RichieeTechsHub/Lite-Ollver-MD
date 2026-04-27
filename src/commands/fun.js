const { sendText } = require("../utils/helpers");

module.exports = {
  category: "FUN MENU",
  commands: ["joke", "quote", "fact"],
  async execute({ sock, msg, command }) {
    const from = msg.key.remoteJid;

    if (command === "joke") {
      return sendText(
        sock,
        from,
        "😄 Joke: Why did the coder quit his job? Because he didn't get arrays.",
        msg
      );
    }

    if (command === "quote") {
      return sendText(
        sock,
        from,
        "💡 Quote: Success is built one fix at a time.",
        msg
      );
    }

    if (command === "fact") {
      return sendText(
        sock,
        from,
        "📘 Fact: JavaScript can run both in the browser and on servers with Node.js.",
        msg
      );
    }
  }
};
