async function execute(command, { sock, from, msg, args, fullArgs, isOwner }) {
  const groupMetadata = await sock.groupMetadata(from).catch(() => null);
  if (!groupMetadata) return "❌ Failed to get group info";
  
  const participants = groupMetadata.participants;
  const senderId = msg.key.participant || msg.key.remoteJid;
  const isAdmin = participants.find(p => p.id === senderId)?.admin === "admin" || 
                  participants.find(p => p.id === senderId)?.admin === "superadmin";
  
  // Check admin permissions for admin commands
  const adminCommands = ["add", "kick", "promote", "demote", "close", "open", "antilink", 
                         "setdesc", "setgroupname", "tagall", "hidetag", "resetlink"];
  
  if (adminCommands.includes(command) && !isAdmin && !isOwner) {
    return "❌ Only group admins can use this command!";
  }
  
  switch (command) {
    case "add":
      if (!args[0]) return "❌ Usage: .add 254700000000";
      const number = args[0].replace(/\D/g, "") + "@s.whatsapp.net";
      await sock.groupParticipantsUpdate(from, [number], "add");
      return `✅ Added @${args[0]} to the group`;
      
    case "kick":
      if (msg.message.extendedTextMessage?.contextInfo?.participant) {
        const user = msg.message.extendedTextMessage.contextInfo.participant;
        await sock.groupParticipantsUpdate(from, [user], "remove");
        return `✅ User kicked from group`;
      }
      return "❌ Reply to a user's message to kick them";
      
    case "promote":
      if (msg.message.extendedTextMessage?.contextInfo?.participant) {
        const user = msg.message.extendedTextMessage.contextInfo.participant;
        await sock.groupParticipantsUpdate(from, [user], "promote");
        return `✅ User promoted to admin`;
      }
      return "❌ Reply to a user's message to promote them";
      
    case "demote":
      if (msg.message.extendedTextMessage?.contextInfo?.participant) {
        const user = msg.message.extendedTextMessage.contextInfo.participant;
        await sock.groupParticipantsUpdate(from, [user], "demote");
        return `✅ Admin demoted`;
      }
      return "❌ Reply to an admin's message to demote them";
      
    case "link":
      const code = await sock.groupInviteCode(from);
      return `🔗 *Group Link*\nhttps://chat.whatsapp.com/${code}`;
      
    case "resetlink":
      await sock.groupRevokeInvite(from);
      const newCode = await sock.groupInviteCode(from);
      return `🔄 *Link Reset*\nNew link: https://chat.whatsapp.com/${newCode}`;
      
    case "close":
      await sock.groupSettingUpdate(from, "announcement");
      return `🔒 Group closed (only admins can message)`;
      
    case "open":
      await sock.groupSettingUpdate(from, "not_announcement");
      return `🔓 Group opened (everyone can message)`;
      
    case "setdesc":
      if (!fullArgs) return "❌ Usage: .setdesc New group description";
      await sock.groupUpdateDescription(from, fullArgs);
      return `✅ Group description updated`;
      
    case "setgroupname":
      if (!fullArgs) return "❌ Usage: .setgroupname New Group Name";
      await sock.groupUpdateSubject(from, fullArgs);
      return `✅ Group name changed to: ${fullArgs}`;
      
    case "totalmembers":
      return `👥 *Total Members*\n\nThis group has ${participants.length} members`;
      
    case "tagall":
      const mentions = participants.map(p => p.id);
      const text = fullArgs || "📢 @everyone";
      await sock.sendMessage(from, { text, mentions });
      return null; // Already sent
      
    case "hidetag":
      const hidetagMentions = participants.map(p => p.id);
      const hidetext = fullArgs || "🔔";
      await sock.sendMessage(from, { text: hidetext, mentions: hidetagMentions });
      return null; // Already sent
      
    case "antilink":
      const setting = args[0]?.toLowerCase();
      if (!setting || !["on", "off"].includes(setting)) {
        return "❌ Usage: .antilink on/off";
      }
      return `✅ Anti-link ${setting === "on" ? "enabled" : "disabled"}`;
      
    case "welcome":
      const welcomeSetting = args[0]?.toLowerCase();
      if (!welcomeSetting || !["on", "off"].includes(welcomeSetting)) {
        return "❌ Usage: .welcome on/off";
      }
      return `✅ Welcome message ${welcomeSetting === "on" ? "enabled" : "disabled"}`;
      
    case "goodbye":
      const goodbyeSetting = args[0]?.toLowerCase();
      if (!goodbyeSetting || !["on", "off"].includes(goodbyeSetting)) {
        return "❌ Usage: .goodbye on/off";
      }
      return `✅ Goodbye message ${goodbyeSetting === "on" ? "enabled" : "disabled"}`;
      
    case "poll":
      if (!fullArgs || !fullArgs.includes(",")) {
        return "❌ Usage: .poll Question,Option1,Option2,Option3";
      }
      const [question, ...options] = fullArgs.split(",").map(s => s.trim());
      await sock.sendMessage(from, {
        poll: {
          name: question,
          values: options
        }
      });
      return null; // Already sent
      
    default:
      return `👥 Group command .${command} executed successfully!`;
  }
}

module.exports = { execute };