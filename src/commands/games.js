async function execute(command, { args, fullArgs }) {
  const dares = [
    "Send a screenshot of your last photo",
    "Type with your eyes closed for the next message",
    "Send your most used emoji",
    "Do 10 pushups right now",
    "Send a voice note singing your favorite song",
    "Change your display name to 'Bot Lover' for 1 hour",
    "Send a selfie with a funny face",
    "Text your mom 'I love you' right now"
  ];
  
  const truths = [
    "What's your biggest fear?",
    "Have you ever lied to your best friend?",
    "What's your secret talent?",
    "Who was your first crush?",
    "What's the most embarrassing thing you've done?",
    "Have you ever cheated on a test?",
    "What's the biggest lie you've ever told?",
    "What's your guilty pleasure?"
  ];
  
  switch (command) {
    case "dare":
      return `🎮 *DARE*\n\n${dares[Math.floor(Math.random() * dares.length)]}\n\n👉 You have 5 minutes to complete!`;
      
    case "truth":
      return `🎮 *TRUTH*\n\n${truths[Math.floor(Math.random() * truths.length)]}\n\n👉 Answer honestly!`;
      
    case "truthordare":
      const todChoice = Math.random() > 0.5 ? "truth" : "dare";
      if (todChoice === "truth") {
        return `🎮 *TRUTH OR DARE*\n\nI choose... *TRUTH!*\n\n${truths[Math.floor(Math.random() * truths.length)]}`;
      } else {
        return `🎮 *TRUTH OR DARE*\n\nI choose... *DARE!*\n\n${dares[Math.floor(Math.random() * dares.length)]}`;
      }
      
    default:
      return null;
  }
}

module.exports = { execute };