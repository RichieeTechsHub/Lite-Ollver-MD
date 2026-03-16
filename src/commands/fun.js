async function execute(command) {
  const facts = [
    "Honey never spoils. Archaeologists found 3000-year-old honey in Egyptian tombs that's still edible!",
    "A day on Venus is longer than a year on Venus. It takes 243 Earth days to rotate but only 225 days to orbit the sun.",
    "Octopuses have three hearts and blue blood!",
    "Bananas are berries, but strawberries aren't. Botanically speaking, berries have seeds inside, not outside.",
    "The Eiffel Tower can be 15 cm taller during summer due to thermal expansion of the iron.",
    "Your brain uses 20% of your body's oxygen and calories, even though it's only 2% of your mass.",
    "A group of flamingos is called a 'flamboyance'!",
    "The shortest war in history was between Britain and Zanzibar on August 27, 1896. It lasted only 38 minutes."
  ];
  
  const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "What do you call a fake noodle? An impasta!",
    "Why did the scarecrow win an award? He was outstanding in his field!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why don't eggs tell jokes? They'd crack each other up!",
    "What do you call a sleeping bull? A bulldozer!",
    "Why did the math book look so sad? Because it had too many problems!",
    "What do you call a fish wearing a bowtie? Sofishticated!"
  ];
  
  const quotes = [
    "Be the change you wish to see in the world. - Mahatma Gandhi",
    "Stay hungry, stay foolish. - Steve Jobs",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Life is what happens when you're busy making other plans. - John Lennon",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "Everything you've ever wanted is on the other side of fear. - George Addair",
    "The only impossible journey is the one you never begin. - Tony Robbins"
  ];
  
  const memes = [
    "https://i.imgur.com/1.jpg",
    "https://i.imgur.com/2.jpg",
    "https://i.imgur.com/3.jpg"
  ];
  
  switch (command) {
    case "fact":
      return `📌 *Random Fact*\n\n${facts[Math.floor(Math.random() * facts.length)]}`;
      
    case "jokes":
      return `😄 *Joke Time*\n\n${jokes[Math.floor(Math.random() * jokes.length)]}`;
      
    case "memes":
      return `🖼️ *Meme*\n\n${memes[Math.floor(Math.random() * memes.length)]}\n\n😂 Hope this made you laugh!`;
      
    case "quotes":
      return `💭 *Inspirational Quote*\n\n${quotes[Math.floor(Math.random() * quotes.length)]}`;
      
    case "trivia":
      const trivia = [
        "What is the capital of Japan? (Answer: Tokyo)",
        "Which planet is known as the Red Planet? (Answer: Mars)",
        "What is the largest ocean on Earth? (Answer: Pacific Ocean)",
        "Who painted the Mona Lisa? (Answer: Leonardo da Vinci)"
      ];
      return `❓ *Trivia Question*\n\n${trivia[Math.floor(Math.random() * trivia.length)]}`;
      
    default:
      return null;
  }
}

module.exports = { execute };