async function execute(command) {
  
  const facts = [
    "Honey never spoils! Archaeologists found 3000-year-old honey in Egyptian tombs.",
    "Octopuses have three hearts and blue blood! 💙",
    "Bananas are berries, but strawberries aren't.",
    "A day on Venus is longer than a year on Venus.",
    "The Eiffel Tower can be 15 cm taller during summer."
  ];
  
  const jokes = [
    "Why don't scientists trust atoms? Because they make up everything! ⚛️",
    "What do you call a fake noodle? An impasta! 🍝",
    "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
    "What do you call a bear with no teeth? A gummy bear! 🐻"
  ];
  
  const quotes = [
    "Be the change you wish to see in the world. - Gandhi",
    "Stay hungry, stay foolish. - Steve Jobs",
    "The only way to do great work is to love what you do. - Steve Jobs"
  ];
  
  const memes = [
    "https://i.imgflip.com/1bij.jpg",
    "https://i.imgflip.com/1g8my.jpg",
    "https://i.imgflip.com/4t0m5.jpg"
  ];
  
  const trivia = [
    {
      question: "What is the capital of Japan?",
      answer: "Tokyo",
      funFact: "Tokyo was originally called Edo until 1868!"
    },
    {
      question: "Which planet is known as the Red Planet?",
      answer: "Mars",
      funFact: "Mars has the largest volcano in the solar system!"
    }
  ];
  
  switch (command) {
    case "fact":
      return `📌 *RANDOM FACT*\n\n${facts[Math.floor(Math.random() * facts.length)]}`;
      
    case "jokes":
      return `😄 *JOKE TIME*\n\n${jokes[Math.floor(Math.random() * jokes.length)]}`;
      
    case "memes":
      return `🖼️ *RANDOM MEME*\n\n${memes[Math.floor(Math.random() * memes.length)]}`;
      
    case "quotes":
      return `💭 *INSPIRATIONAL QUOTE*\n\n${quotes[Math.floor(Math.random() * quotes.length)]}`;
      
    case "trivia":
      const item = trivia[Math.floor(Math.random() * trivia.length)];
      return `❓ *TRIVIA*\n\nQuestion: ${item.question}\nAnswer: ||${item.answer}||\n\nFun Fact: ${item.funFact}`;
      
    default:
      return null;
  }
}

module.exports = { execute };
