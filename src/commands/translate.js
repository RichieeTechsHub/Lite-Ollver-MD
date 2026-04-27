<<<<<<< HEAD
async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *translate* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "translate", description: "translate command", execute };
=======
async function execute(command, { args, fullArgs }) {
  
  if (!fullArgs) {
    return "❌ Usage: .translate Hello (to English)\nOr .translate es Hello (Spanish to English)";
  }
  
  return `🌐 *TRANSLATION*\n\nOriginal: ${fullArgs}\nTranslated: [${fullArgs} in English]\n\n_Translation service simulated_`;
}

module.exports = { execute };
>>>>>>> 947c453f6ed8e135658b8662b1f2e94d9a4a09d3
