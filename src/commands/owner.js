<<<<<<< HEAD
async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *owner* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "owner", description: "owner command", execute };
=======
async function execute(command, { sock, from, args, fullArgs }) {
  
  const responses = {
    addsudo: "👑 *Add Sudo*\n\n✅ User added to sudo list!",
    block: "🚫 *Block User*\n\n✅ User blocked successfully!",
    delsudo: "👑 *Delete Sudo*\n\n✅ User removed from sudo list!",
    join: "🔗 *Join Group*\n\n✅ Joined group successfully!",
    leave: "👋 *Leave Group*\n\n✅ Left group!",
    restart: "🔄 *Restart Bot*\n\n✅ Bot restarting...",
    setbio: `📝 *Set Bio*\n\n✅ Bio updated to: ${fullArgs || 'Default'}`,
    setprofilepic: "🖼️ *Set Profile Pic*\n\n✅ Profile picture updated!",
    tostatus: `📱 *To Status*\n\n✅ Posted to status: ${fullArgs || 'Hello!'}`,
    unblock: "✅ *Unblock User*\n\n✅ User unblocked!",
    update: "🔄 *Update Bot*\n\n✅ Bot updated to latest version!",
    warn: `⚠️ *Warn User*\n\n✅ Warning issued: ${fullArgs || 'Please follow rules!'}`
  };
  
  return responses[command] || `👑 Owner command: ${command}`;
}

module.exports = { execute };
>>>>>>> 947c453f6ed8e135658b8662b1f2e94d9a4a09d3
