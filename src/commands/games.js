async function execute(command) {
  
  const dares = [
    "Send a screenshot of your last photo! 📸",
    "Do 10 pushups right now! 💪",
    "Send a voice note singing your favorite song! 🎤",
    "Send your most used emoji! 🔥",
    "Change your display name to 'Bot Lover' for 1 hour! 😎"
  ];
  
  const truths = [
    "What's your biggest fear? 😨",
    "Have you ever lied to your best friend? 🤥",
    "What's your secret talent? ⚡",
    "Who was your first crush? 💕",
    "What's the most embarrassing thing you've done? 😳"
  ];
  
  switch (command) {
    case "dare":
      return `🎮 *DARE*\n\n${dares[Math.floor(Math.random() * dares.length)]}\n\n👉 You have 5 minutes! ⏱️`;
      
    case "truth":
      return `🎮 *TRUTH*\n\n${truths[Math.floor(Math.random() * truths.length)]}\n\n👉 Answer honestly! 🤞`;
      
    case "truthordare":
      const choice = Math.random() > 0.5 ? "truth" : "dare";
      if (choice === "truth") {
        return `🎮 *TRUTH OR DARE*\n\nI choose... *TRUTH!*\n\n${truths[Math.floor(Math.random() * truths.length)]}`;
      } else {
        return `🎮 *TRUTH OR DARE*\n\nI choose... *DARE!*\n\n${dares[Math.floor(Math.random() * dares.length)]}`;
      }
      
    default:
      return null;
  }
}

module.exports = { execute };
