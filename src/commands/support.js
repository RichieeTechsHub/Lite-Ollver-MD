async function execute(command, { config }) {
  
  const responses = {
    feedback: `💭 *FEEDBACK*\n\nSend your feedback to: ${config.OWNER_CONTACT}`,
    helpers: `👥 *HELPERS*\n\nJoin support group: ${config.SUPPORT_GROUP}`,
    support: `💬 *SUPPORT*\n\nGroup: ${config.SUPPORT_GROUP}\nOwner: ${config.OWNER_CONTACT}`
  };
  
  return responses[command] || `💬 Support command: ${command}`;
}

module.exports = { execute };
