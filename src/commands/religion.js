async function execute(command, { args, fullArgs }) {
  
  const responses = {
    bible: `📖 *BIBLE VERSE*\n\n"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." - John 3:16`,
    quran: `📖 *QURAN VERSE*\n\n"Indeed, Allah is with the patient." - Quran 2:153`
  };
  
  return responses[command] || `📖 Religion command: ${command}`;
}

module.exports = { execute };
