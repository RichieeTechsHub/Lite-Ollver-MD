module.exports = {
  // Bot Identity
  BOT_NAME: process.env.BOT_NAME || "Lite-Ollver-MD",
  VERSION: "1.0.0",
  
  // Owner Info
  OWNER_NAME: process.env.OWNER_NAME || "RichieeTheeGoat",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "254740479599",
  OWNER_CONTACT: `https://wa.me/${process.env.OWNER_NUMBER || "254740479599"}`,
  
  // Bot Settings
  PREFIX: process.env.PREFIX || ".",
  MODE: process.env.MODE || "public",
  TIMEZONE: process.env.TIMEZONE || "Africa/Nairobi",
  
  // Support
  SUPPORT_GROUP: "https://chat.whatsapp.com/JKF3XHbmKY47IQZc7d3LB2",
  
  // Status Features
  STATUS_EMOJI: process.env.STATUS_EMOJI || "😂",
  STATUS_DELAY: parseInt(process.env.STATUS_DELAY) || 10,
  
  // Auto Features
  AUTOTYPING: process.env.AUTOTYPING === "true" || false,
  AUTORECORDING: process.env.AUTORECORDING === "true" || false,
  AUTOREAD_STATUS: process.env.AUTOREAD_STATUS === "true" || false,
  AUTOREACT_STATUS: process.env.AUTOREACT_STATUS === "true" || false,
  
  // Session
  SESSION_PREFIX: "LITE-OLLVER-MD:~"
};