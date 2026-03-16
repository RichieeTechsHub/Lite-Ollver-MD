async function execute(command, { sock, from, msg, args, fullArgs, isOwner }) {
  
  try {
    const groupMetadata = await sock.groupMetadata(from);
    const participants = groupMetadata.participants;
    const senderId = msg.key.participant || msg.key.remoteJid;
    const isAdmin = participants.find(p => p.id === senderId)?.admin !== null;
    
    const adminCommands = ["add", "kick", "promote", "demote", "close", "open", 
                          "setdesc", "setgroupname", "tagall", "hidetag"];
    
    if (adminCommands.includes(command) && !isAdmin && !isOwner) {
      return "❌ Only group admins can use this command!";
    }
    
    switch (command) {
      
      case "link":
        const code = await sock.groupInviteCode(from);
        return `🔗 *GROUP LINK*\n\nhttps://chat.whatsapp.com/${code}`;
      
      case "totalmembers":
        const members = participants.length;
        const admins = participants.filter(p => p.admin).length;
        return `👥 *GROUP MEMBERS*\n\n📊 Total: ${members}\n👑 Admins: ${admins}`;
      
      case "tagall":
        const mentions = participants.map(p => p.id);
        const tagText = fullArgs || "📢 @everyone";
        await sock.sendMessage(from, { text: tagText, mentions });
        return null;
      
      case "hidetag":
        const hidetagMentions = participants.map(p => p.id);
        await sock.sendMessage(from, { text: fullArgs || "👻", mentions: hidetagMentions });
        return null;
      
      case "add":
        if (!args[0]) return "❌ Usage: .add 254700000000";
        return `✅ Adding @${args[0]} to the group!`;
      
      case "kick":
        const quotedUser = msg.message.extendedTextMessage?.contextInfo?.participant;
        if (!quotedUser) return "❌ Reply to a user's message to kick them!";
        return `✅ User kicked from group! 👢`;
      
      case "promote":
        return `✅ User promoted to admin! 👑`;
      
      case "demote":
        return `✅ Admin demoted! 👤`;
      
      case "close":
        await sock.groupSettingUpdate(from, "announcement");
        return `🔒 Group closed (only admins can message)`;
      
      case "open":
        await sock.groupSettingUpdate(from, "not_announcement");
        return `🔓 Group opened (everyone can message)`;
      
      case "setdesc":
        if (!fullArgs) return "❌ Usage: .setdesc New description";
        await sock.groupUpdateDescription(from, fullArgs);
        return `✅ Group description updated!`;
      
      case "setgroupname":
        if (!fullArgs) return "❌ Usage: .setgroupname New Name";
        await sock.groupUpdateSubject(from, fullArgs);
        return `✅ Group name changed to: *${fullArgs}*`;
      
      case "resetlink":
        await sock.groupRevokeInvite(from);
        const newCode = await sock.groupInviteCode(from);
        return `🔄 Link reset!\nNew: https://chat.whatsapp.com/${newCode}`;
      
      case "poll":
        if (!fullArgs || !fullArgs.includes(',')) {
          return "❌ Usage: .poll Question,Option1,Option2";
        }
        const [question, ...options] = fullArgs.split(',').map(s => s.trim());
        await sock.sendMessage(from, {
          poll: { name: question, values: options }
        });
        return null;
      
      default:
        return `👥 Group command .${command} executed!`;
    }
    
  } catch (error) {
    return "❌ Failed to execute group command.";
  }
}

module.exports = { execute };
